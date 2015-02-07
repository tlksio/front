var oauth = require('oauth');
var uuid = require('uuid');
var MongoClient = require('mongodb').MongoClient;
var util = require('util');

var config = require('../../config.json');
var talk = require('../models/talk');

var _twitterConsumerKey = "P1LBfEJNOHDaTSOQrmAb5Gvil";
var _twitterConsumerSecret = "8B6wkuXDloxrmx1uUZlQEmaSnUzVU3n48XYEcHfzFe33sNu8KK";

var consumer = new oauth.OAuth(
    "https://twitter.com/oauth/request_token",
    "https://twitter.com/oauth/access_token",
    _twitterConsumerKey,
    _twitterConsumerSecret,
    "1.0A",
    config.twitter_callback_url,
    "HMAC-SHA1"
);

exports.index = function (req, res) {
    // user
    var user = req.session.user; 
    var context = {
        user: user
    };
    // latest talks
    talk.latest(5, function (err, talks) {
        if (err) { throw new Error(err); }
        context.latest = talks;
        // popular talks
        talk.popular(5, function (err, talks) {
            if (err) { throw new Error(err); }
            context.popular = talks;
            //render
            res.render('index', context);
        });
    });
};

exports.privacy = function (req, res) {
    var user = req.session.user;
    var context = {
        user: user
    };
    res.render('privacy', context);
};

exports.terms = function (req, res) {
    var user = req.session.user;
    var context = {
        user: user
    };
    res.render('terms', context);
};

exports.about = function (req, res) {
    var user = req.session.user;
    var context = {
        user: user
    };
    res.render('about', context);
};

exports.faq = function (req, res) {
    var user = req.session.user;
    var context = {
        user: user
    };
    res.render('faq', context);
};

exports.login = function (req, res) {
    var user = req.session.user;
    var context = {
        user: user
    };
    res.render('login', context);
};

exports.add = function (req, res) {
    var user = req.session.user;
    if (user === undefined) {
        res.status(401).send("401").end();
    } else {
        var context = {
            user: user
        };
        res.render('add', context);
    }
};

exports.save = function (req, res) {
    // user
    var user = req.session.user;
    var context = {
        user: user
    };
    if (user===undefined) {
        res.status(401).send("401").end();
    } else {
        // talk
        var talk = {
            id: uuid.v1(),
            code: req.body.code,
            title: req.body.title,
            description: req.body.description,
            author: {
                id: user.id,
                username: user.screen_name,
                avatar: user.avatar
            },
            "views": 0,
            "votes": 0,
            "likes": 0,
            "tags": []
        };
        // create talk
        talk.create(talk, function (err, talk) {
            if (err) { throw new Error(err); }
            // render
            res.redirect('/');
        });
    }
};

exports.profile = function (req, res) {
    var user = req.session.user;
    var context = {
        user: user
    };
    if (user === undefined) {
        res.status(401).send("401").end();
    } else {
        res.render('profile', context);
    }
};

exports.settings = function (req, res) {
    var user = req.session.user;
    var context = {
        user: user
    };
    if (user === undefined) {
        res.status(401).send("401").end();
    } else {
        res.render('settings', context);
    }
};

exports.authLogout = function (req, res) {
    req.session.user = undefined;
    res.redirect('/');
};

exports.authTwitter = function (req, res) {
    consumer.getOAuthRequestToken(function (error, oauthToken, oauthTokenSecret, results) {
        if (error) {
            res.send("Error getting OAuth request token : " + util.inspect(error), 500);
        } else {
            req.session.oauthRequestToken = oauthToken;
            req.session.oauthRequestTokenSecret = oauthTokenSecret;
            res.redirect("https://twitter.com/oauth/authorize?oauth_token=" + req.session.oauthRequestToken);
        }
    });
};

exports.authTwitterCallback = function (req, res) {
    // util.puts(">> Request Token : " + req.session.oauthRequestToken);
    // util.puts(">> Request Token Secret : " + req.session.oauthRequestTokenSecret);
    // util.puts(">> OAuth Verifier : " + req.query.oauth_verifier);
    consumer.getOAuthAccessToken(
        req.session.oauthRequestToken,
        req.session.oauthRequestTokenSecret,
        req.query.oauth_verifier,
        function (error, oauthAccessToken, oauthAccessTokenSecret, results) {
            if (error) {
                var msg = "Error getting OAuth access token : ";
                msg += util.inspect(error);
                msg += "[ oauthAccessToken : " + oauthAccessToken + "]";
                msg += "[ oauthAccessTokenSecret : " + oauthAccessTokenSecret + "]";
                msg += "[ results : " + util.inspect(results) + "]";
                res.status(500).send(msg).end();
            } else {
                req.session.user = results;
                req.session.oauthAccessToken = oauthAccessToken;
                req.session.oauthAccessTokenSecret = oauthAccessTokenSecret;

                consumer.get(
                    "https://api.twitter.com/1.1/account/verify_credentials.json",
                    req.session.oauthAccessToken,
                    req.session.oauthAccessTokenSecret, function (error, data, response) {
                        if (error) {
                            res.status(500).send("Error getting twitter screen name : " + util.inspect(error)).end();
                        } else {
                            var parsedData = JSON.parse(data);
                            req.session.user.id = parsedData.id;
                            req.session.user.avatar = parsedData.profile_image_url;
                            res.redirect('/');
                        }
                    }
                );
            }
        }
    );
};

exports.play = function (req, res) {
    var id = req.params.id;
    talk.play(id, function (err, talk) {
        var url = 'https://www.youtube.com/watch?v='+talk.code;
        res.redirect(url);
    });
};

exports.talk = function (req, res) {
    var id = req.params.id;
    var user = req.session.user;
    var context = {
        user: user
    };
    talk.get(id, function (err, talk) {
        if (err) { throw new Error(err); }
        context.talk = talk;
        res.render("talk", context);
    });
};

exports.publicProfile = function (req, res) {
    var username = req.params.username;
    var user = req.session.user;
    var context = {
        user: user
    };
    MongoClient.connect(config.mongodb, function (err, db) {
        var users = db.collection('users');
        users.findOne({"username": username}, function (err, profile) {
            if (err) { throw new Error(err); }
            db.close();
            context.profile = profile;
            res.render("public_profile.jade", context);
        });
    });
};
