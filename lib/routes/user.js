/*jshint unused:false*/
var util = require('util');

var config = require('../../config.json');
var talks = require('libtlks').talk;
var users = require('libtlks').user;

/**
 * Route /profile
 * @param req   HTTP Request object
 * @param res   HTTP Response object
 */
exports.profile = function(req, res, next) {
    'use strict';

    var username = req.params.username;
    var user = req.session.user;
    var context = {
        title: 'tlks.io : ' + username + '\'s profile',
        user: user
    };
    users.getByUsername(config.mongodb, username, function(err, profile) {
        if (err) {
            return next(err);
        }
        if (profile) {
            context.profile = profile;
            talks.getByAuthorId(
                config.mongodb,
                profile.id,
                function(err, talks) {
                    if (err) {
                        return next(err);
                    }
                    context.posted = talks;
                    res.render('profile.jade', context);
                });
        } else {
            res.status(404).render('404', context);
        }
    });
};

/**
 * Route /settings
 * @param req   HTTP Request object
 * @param res   HTTP Response object
 */
exports.profileUpvoted = function(req, res, next) {
    'use strict';

    var username = req.params.username;
    var user = req.session.user;
    var context = {
        title: 'tlks.io : ' + username + '\'s upvoted talks',
        user: user
    };
    users.getByUsername(config.mongodb, username, function(err, profile) {
        if (err) {
            return next(err);
        }
        if (profile) {
            context.profile = profile;
            talks.getUpvotedByAuthorId(
                config.mongodb,
                profile.id,
                function(err, talks) {
                    if (err) {
                        return next(err);
                    }
                    context.upvoted = talks;
                    res.render('profile.upvoted.jade', context);
                });
        } else {
            res.status(404).render('404', context);
        }
    });
};

/**
 * Route /settings
 * @param req   HTTP Request object
 * @param res   HTTP Response object
 */
exports.profileFavorited = function(req, res, next) {
    'use strict';

    var username = req.params.username;
    var user = req.session.user;
    var context = {
        title: 'tlks.io : ' + username + '\'s upvoted talks',
        user: user
    };
    users.getByUsername(config.mongodb, username, function(err, profile) {
        if (err) {
            return next(err);
        }
        if (profile) {
            context.profile = profile;
            talks.getFavoritedByAuthorId(
                config.mongodb,
                profile.id,
                function(err, talks) {
                    if (err) {
                        return next(err);
                    }
                    context.favorited = talks;
                    res.render('profile.favorited.jade', context);
                });
        } else {
            res.status(404).render('404', context);
        }
    });
};


/**
 * Route /settings
 * @param req   HTTP Request object
 * @param res   HTTP Response object
 */
exports.settings = function(req, res, next) {
    'use strict';

    var user = req.session.user;
    if (user === undefined) {
        var err = {
            status: 401,
            message: 'Unauthorized'
        };
        return next(err);
    } else {
        var context = {
            title: 'tlks.io : ' + user.username + '\'s settings',
            user: user
        };
        res.render('settings', context);
    }
};

/**
 * Route /settings
 * @param req   HTTP Request object
 * @param res   HTTP Response object
 */
exports.settingsSave = function(req, res, next) {
    'use strict';

    var user = req.session.user;
    user.bio = req.body.bio;
    user.email = req.body.email;
    user.url = req.body.url;
    users.update(config.mongodb, user, function(err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
};
