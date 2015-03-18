var oauth = require('oauth');
var uuid = require('uuid');
var moment = require('moment');
var util = require('util');

var config = require('../../config.json');

var libtlks = require('libtlks');

var consumer = new oauth.OAuth(
    "https://twitter.com/oauth/request_token",
    "https://twitter.com/oauth/access_token",
    config.twitterConsumerKey,
    config.twitterConsumerSecret,
    "1.0A",
    config.twitter_callback_url,
    "HMAC-SHA1"
);

/**
 * Route /
 * @param req   HTTP Request object
 * @param res   HTTP Response object
 */
exports.index = function(req, res) {
    "use strict";

    var limit = 5;
    var user = req.session.user;
    var context = {
        title: 'tlks.io : A comunity driven curated list of tech talks',
        user: user
    };
    libtlks.talk.latest(config.mongodb, limit, function(err, talks) {
        if (err) {
            res.status(500).send("Error : " + util.inspect(err)).end();
        }
        context.latest = talks;
        libtlks.talk.popular(config.mongodb, limit, function(err, talks) {
            if (err) {
                res.status(500).send("Error : " + util.inspect(err)).end();
            }
            context.popular = talks;
            res.render('index', context);
        });
    });
};

/**
 * Route /activity
 * @param req   HTTP Request object
 * @param res   HTTP Response object
 */
exports.activity = function(req, res) {
    "use strict";

    var user = req.session.user;
    var context = {
        title: "tlks.io : Recent activity log",
        user: user,
        moment: moment
    };
    libtlks.talk.latest(config.mongodb, 25, function(err, talks) {
        if (err) {
            res.status(500).send("Error : " + util.inspect(err)).end();
        }
        context.activity = talks;
        res.render('activity', context);
    });
};

/**
 * Route /login
 * @param req   HTTP Request object
 * @param res   HTTP Response object
 */
exports.login = function(req, res) {
    "use strict";

    var user = req.session.user;
    var context = {
        title: "tlks.io : Sign in",
        user: user
    };
    res.render('login', context);
};

/**
 * Route /logout
 * @param req   HTTP Request object
 * @param res   HTTP Response object
 */
exports.authLogout = function(req, res) {
    "use strict";

    req.session.user = undefined;
    res.redirect('/');
};

/**
 * Route /auth/twitter
 * @param req   HTTP Request object
 * @param res   HTTP Response object
 */
exports.authTwitter = function(req, res) {
    "use strict";

    consumer.getOAuthRequestToken(function(error, oauthToken, oauthTokenSecret, results) {
        if (error) {
            res.send("Error getting OAuth request token : " + util.inspect(error), 500);
        } else {
            req.session.oauthRequestToken = oauthToken;
            req.session.oauthRequestTokenSecret = oauthTokenSecret;
            res.redirect("https://twitter.com/oauth/authorize?oauth_token=" + req.session.oauthRequestToken);
        }
    });
};

/**
 * Route /auth/twitter/callback
 * @param req   HTTP Request object
 * @param res   HTTP Response object
 */
exports.authTwitterCallback = function(req, res) {
    "use strict";

    // util.puts(">> Request Token : " + req.session.oauthRequestToken);
    // util.puts(">> Request Token Secret : " + req.session.oauthRequestTokenSecret);
    // util.puts(">> OAuth Verifier : " + req.query.oauth_verifier);
    consumer.getOAuthAccessToken(
        req.session.oauthRequestToken,
        req.session.oauthRequestTokenSecret,
        req.query.oauth_verifier,
        function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
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
                    req.session.oauthAccessTokenSecret, function(error, data, response) {
                        console.log(data);
                        if (error) {
                            res.status(500).send("Error getting twitter screen name : " + util.inspect(error)).end();
                        } else {
                            var parsedData = JSON.parse(data);
                            var user = {
                                id: uuid.v1(),
                                avatar: parsedData.profile_image_url,
                                username: parsedData.screen_name,
                                bio: parsedData.description,
                                twitterId: parsedData.id,
                                created: Date.now(),
                                updated: Date.now()
                            };

                            libtlks.user.getByUsername(config.mongodb, user.username, function(err, dbuser) {

                                if (err) {
                                    res.status(500).send("Error : " + util.inspect(err)).end();
                                }
                                if (dbuser) {
                                    req.session.user = dbuser;
                                    res.redirect('/');
                                } else {
                                    libtlks.user.create(config.mongodb, user, function(err, docs) {
                                        if (err) {
                                            res.status(500).send("Error : " + util.inspect(err)).end();
                                        }
                                        req.session.user = docs[0];
                                        res.redirect('/');
                                    });
                                }

                            });
                        }
                    }
                );
            }
        }
    );
};
