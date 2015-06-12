/*jshint unused:false*/
var util = require('util');

var config = require('../../config.json');
var cache = require('../cache');
var talks = require('libtlks').talk;
var users = require('libtlks').user;

/**
 * Route /profile
 *
 * Renders Profile template.
 * It caches the result for 5 minutes.
 *
 * @param req   HTTP Request object
 * @param res   HTTP Response object
 */
exports.profile = function(req, res, next) {
    'use strict';
    cache.render(req, res, function() {
        var quantity = 25;
        var page = parseInt(req.params.page || 1);
        var pagination = {
            page: page,
            next: page + 1,
            prev: (page - 1 <= 1) ? 1 : page - 1
        };
        var username = req.params.username;
        var user = req.session.user;
        var context = {
            title: 'tlks.io : ' + username + '\'s profile',
            user: user,
            page: page,
            pagination: pagination
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
                    quantity,
                    page,
                    function(err, talks) {
                        if (err) {
                            return next(err);
                        }
                        if ((talks.length === 0) && (page > 1)) {
                            res.status(204).end();
                            return;
                        }
                        context.posted = talks;
                        var filePath = __dirname + "/../../src/views/profile.jade";
                        var html = cache.compile(req.url, filePath, context);
                        res.write(html);
                        res.end();
                    });
            } else {
                res.status(404).render('404', context);
            }
        });
    }, cache.min5);
};

/**
 * Route /settings
 * @param req   HTTP Request object
 * @param res   HTTP Response object
 */
exports.profileUpvoted = function(req, res, next) {
    'use strict';

    var quantity = 25;
    var page = parseInt(req.params.page || 1);
    var pagination = {
        page: page,
        next: page + 1,
        prev: (page - 1 <= 1) ? 1 : page - 1
    };
    var username = req.params.username;
    var user = req.session.user;
    var context = {
        title: 'tlks.io : ' + username + '\'s upvoted talks',
        user: user,
        pagination: pagination
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
                quantity,
                page,
                function(err, talks) {
                    if (err) {
                        return next(err);
                    }
                    if ((talks.length === 0) && (page > 1)) {
                        res.status(204).end();
                        return;
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

    var quantity = 25;
    var page = parseInt(req.params.page || 1);
    var pagination = {
        page: page,
        next: page + 1,
        prev: (page - 1 <= 1) ? 1 : page - 1
    };
    var username = req.params.username;
    var user = req.session.user;
    var context = {
        title: 'tlks.io : ' + username + '\'s upvoted talks',
        user: user,
        pagination: pagination
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
                quantity,
                page,
                function(err, talks) {
                    if (err) {
                        return next(err);
                    }
                    if ((talks.length === 0) && (page > 1)) {
                        res.status(204).end();
                        return;
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
            user: user,
            csrfToken: req.csrfToken()
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
