var oauth = require('oauth');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var util = require('util');

var config = require('../../config.json');

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
    var user = req.session.user; 
    var context = {
        user: user
    };
    MongoClient.connect(config.mongodb, function(err, db) {
        var talks = db.collection('talks');
        talks.find({}).toArray(function(err, docs) {
            context.talks = docs;
            db.close();
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
    var context = {
        user: user
    };
    res.render('add', context);
};

exports.profile = function (req, res) {
    var user = req.session.user;
    var context = {
        user: user
    };
    res.render('profile', context);
};

exports.settings = function (req, res) {
    var user = req.session.user;
    var context = {
        user: user
    };
    res.render('settings', context);
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
        req.query.oauth_verifier, function (error, oauthAccessToken, oauthAccessTokenSecret, results) {
            if (error) {
                var msg = "Error getting OAuth access token : ";
                msg += util.inspect(error);
                msg += "[ oauthAccessToken : " + oauthAccessToken + "]";
                msg += "[ oauthAccessTokenSecret : " + oauthAccessTokenSecret + "]";
                msg += "[ results : " + util.inspect(results) + "]";
                res.send(msg, 500);
            } else {
                req.session.user = results;
                req.session.oauthAccessToken = oauthAccessToken;
                req.session.oauthAccessTokenSecret = oauthAccessTokenSecret;
                res.redirect('/');
            }
        }
    );

    /*
    consumer.get(
        "http://twitter.com/account/verify_credentials.json",
        req.session.oauthAccessToken,
        req.session.oauthAccessTokenSecret, function (error, data, response) {
            if (error) {
                res.redirect('/sessions/connect');
                // res.send("Error getting twitter screen name : " + util.inspect(error), 500);
            } else {
                var parsedData = JSON.parse(data);
                // req.session.twitterScreenName = response.screen_name;
                res.send('You are signed in: ' + parsedData.screen_name);
                req.session.user = data;
            }
        }
    );
    */
};

exports.play = function (req, res) {
    var id = req.params.id;
    var user = req.session.user; 
    MongoClient.connect(config.mongodb, function(err, db) {
        var talks = db.collection('talks');
        talks.findOne({"_id": new ObjectId(id)}, function (err, talk) {
            if (err) { throw new Error(err); }
            // TODO : Update views
            db.close();
            var url = 'https://www.youtube.com/watch?v='+talk.code;
            res.redirect(url);
        });
    });
};

exports.talk = function (req, res) {
    var id = req.params.id;
    var user = req.session.user;
    var context = {
        user: user
    };
    MongoClient.connect(config.mongodb, function(err, db) {
        var talks = db.collection('talks');
        talks.findOne({"_id": new ObjectId(id)}, function (err, talk) {
            if (err) { throw new Error(err); }
            db.close();
            context.talk = talk;
            res.render("talk", context);
        });
    });

};

