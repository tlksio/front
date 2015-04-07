var oauth = require('oauth');
var uuid = require('uuid');
var moment = require('moment');
var util = require('util');

var config = require('../../config.json');

var libtlks = require('libtlks');

/**
 * Twitter OAuth configuration struct
 */
var consumer = new oauth.OAuth(
    'https://twitter.com/oauth/request_token',
    'https://twitter.com/oauth/access_token',
    config.twitterConsumerKey,
    config.twitterConsumerSecret,
    '1.0A',
    config.twitterCallbackURL,
    'HMAC-SHA1'
);

/**
 * Create or update an user
 *
 * Creates or Updates an user if already exists.
 *
 * @param {string}    dburl     Database connection string
 * @param {function}  callback  Callback function to execute with result.
 */
function createUpdateUser(dburl, username, callback) {
    'use strict';

    libtlks.user.getByUsername(dburl, username, function(err, user) {
        if (err) {
            return callback(err, null);
        }
        if (user) {
            return callback(null, user);
        } else {
            libtlks.user.create(dburl, user, function(err, docs) {
                if (err) {
                    return callback(err, null);
                }
                var user = docs[0];
                return callback(null, user);
            });
        }
    });
}

/**
 * Route /
 * @param req   HTTP Request object
 * @param res   HTTP Response object
 */
exports.index = function(req, res) {
    'use strict';

    var limit = 5;
    var user = req.session.user;
    var title = 'tlks.io : A curated and community driven list of ' +
        'technical talks';
    var context = {
        title: title,
        user: user
    };
    libtlks.talk.latest(config.mongodb, limit, null, function(err, talks) {
        if (err) {
            context.message = util.inspect(err);
            res.status(500).render('500', context);
        }
        context.latest = talks;
        libtlks.talk.popular(config.mongodb, limit, null, function(err, talks) {
            if (err) {
                context.message = util.inspect(err);
                res.status(500).render('500', context);
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
    'use strict';

    var user = req.session.user;
    var context = {
        controller: 'activity',
        title: 'tlks.io : Recent activity log',
        user: user,
        moment: moment
    };
    libtlks.talk.latest(config.mongodb, 25, null, function(err, talks) {
        if (err) {
            context.message = util.inspect(err);
            res.status(500).render('500', context);
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
    'use strict';

    var user = req.session.user;
    var context = {
        title: 'tlks.io : Sign in',
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
    'use strict';

    req.session.user = undefined;
    res.redirect('/');
};

/**
 * Route /auth/twitter
 * @param req   HTTP Request object
 * @param res   HTTP Response object
 */
exports.authTwitter = function(req, res) {
    'use strict';

    consumer.getOAuthRequestToken(
        function(
            err,
            oauthToken,
            oauthTokenSecret,
            results) {
            if (err) {
                var message = 'Error getting OAuth request token : ' +
                    util.inspect(err);
                var context = {
                    message: message
                };
                res.status(500).render('500', context);
            } else {
                req.session.oauthRequestToken = oauthToken;
                req.session.oauthRequestTokenSecret = oauthTokenSecret;
                var url = 'https://twitter.com/oauth/authorize?oauth_token=' +
                    req.session.oauthRequestToken;
                res.redirect(url);
            }
        });
};

/**
 * Route /auth/twitter/callback
 * @param req   HTTP Request object
 * @param res   HTTP Response object
 */
exports.authTwitterCallback = function(req, res) {
    'use strict';

    consumer.getOAuthAccessToken(
        req.session.oauthRequestToken,
        req.session.oauthRequestTokenSecret,
        req.query.oauth_verifier,
        function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
            if (error) {
                var msg = 'Error getting OAuth access token : ' +
                    util.inspect(error) +
                    '[ oauthAccessToken : ' +
                    oauthAccessToken + ']' +
                    '[ oauthAccessTokenSecret : ' +
                    oauthAccessTokenSecret + ']' +
                    '[ results : ' +
                    util.inspect(results) + ']';
                var context = {
                    message: msg
                };
                res.status(500).render('500', context);
            }
            req.session.user = results;
            req.session.oauthAccessToken = oauthAccessToken;
            req.session.oauthAccessTokenSecret = oauthAccessTokenSecret;

            consumer.get(
                'https://api.twitter.com/1.1/account/verify_credentials.json',
                req.session.oauthAccessToken,
                req.session.oauthAccessTokenSecret,
                function(err, data, response) {
                    if (err) {
                        var context = {
                            message: 'Error: ' + util.inspect(err)
                        };
                        res.status(500).render('500', context);
                    } else {
                        var parsedData = JSON.parse(data);
                        var user = {
                            id: uuid.v1(),
                            avatar: parsedData.profile_image_url,
                            username: parsedData.screen_name,
                            bio: parsedData.description,
                            twitterId: parsedData.id,
                            url: '',
                            created: Date.now(),
                            updated: Date.now()
                        };
                        // creates or updates an user after correct auth
                        createUpdateUser(
                            config.mongodb,
                            user.username,
                            function(err, user) {
                                if (err) {
                                    var context = {
                                        message: util.inspect(err)
                                    };
                                    res.status(500).render('500', context);
                                }
                                req.session.user = user;
                                res.redirect('/');
                            });
                    }
                }
            );
        }
    );
};
