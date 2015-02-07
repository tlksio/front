var oauth = require('oauth');
var uuid = require('uuid');
var util = require('util');

var config = require('../../config.json');
var talkModel = require('../models/talk');
var userModel = require('../models/user');

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
    talkModel.latest(5, function (err, talks) {
        if (err) {
            res.status(500).send("Error : " + util.inspect(error)).end();
        }
        context.latest = talks;
        // popular talks
        talkModel.popular(5, function (err, talks) {
            if (err) {
                res.status(500).send("Error : " + util.inspect(error)).end();
            }
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
            if (err) {
                res.status(500).send("Error : " + util.inspect(error)).end();
            }
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
                            // TODO : Create or Load user
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
    talkModel.play(id, function (err, talk) {
        if (err) {
            res.status(500).send("Error : " + util.inspect(error)).end();
        }
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
    talkModel.get(id, function (err, talk) {
        if (err) {
            res.status(500).send("Error : " + util.inspect(error)).end();
        }
        if (talk) {
            context.talk = talk;
            res.render("talk", context);
        } else {
            res.status(404).send("Talk not found").end();
        }
    });
};

exports.publicProfile = function (req, res) {
    var username = req.params.username;
    var user = req.session.user;
    var context = {
        user: user
    };
    userModel.profile(username, function (err, profile) {
        if (err) {
            res.status(500).send("Error : " + util.inspect(error)).end();
        }
        if (profile) {
            context.profile = profile;
            res.render("public_profile.jade", context);
        } else {
            res.status(404).send("User not found").end();
        }
    });
};

exports.tag = function (req, res) {
    var tag = req.params.tag;
    var user = req.session.user;
    var context = {
        user: user,
        tag: tag
    };
    talkModel.getByTag(tag, function (err, talks) {
        if (err) {
            res.status(500).send("Error : " + util.inspect(error)).end();
        }
        context.talks = talks;
        //render
        res.render('tag', context);
    });
}
