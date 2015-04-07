var util = require('util');

var config = require('../../config.json');
var talks = require('libtlks').talk;
var users = require('libtlks').user;

/**
 * Route /profile
 * @param req   HTTP Request object
 * @param res   HTTP Response object
 */
exports.profile = function(req, res) {
    "use strict";

    var username = req.params.username;
    var user = req.session.user;
    var context = {
        title: "tlks.io : " + username + "'s profile",
        user: user
    };
    users.getByUsername(config.mongodb, username, function(err, profile) {
        if (err) {
            context.message = util.inspect(err);
            res.status(500).render("500", context);
        }
        if (profile) {
            context.profile = profile;
            talks.getByAuthorId(
                config.mongodb,
                profile.id,
                function(err, talks) {
                    if (err) {
                        context.message = util.inspect(err);
                        res.status(500).render("500", context);
                    }
                    context.posted = talks;
                    res.render("profile.jade", context);
                });
        } else {
            res.status(404).render("404", context);
        }
    });
};

/**
 * Route /settings
 * @param req   HTTP Request object
 * @param res   HTTP Response object
 */
exports.profileUpvoted = function(req, res) {
    "use strict";

    var username = req.params.username;
    var user = req.session.user;
    var context = {
        title: "tlks.io : " + username + "'s upvoted talks",
        user: user
    };
    users.getByUsername(config.mongodb, username, function(err, profile) {
        if (err) {
            context.message = util.inspect(err);
            res.status(500).render("500", context);
        }
        if (profile) {
            context.profile = profile;
            talks.getUpvotedByAuthorId(
                config.mongodb,
                profile.id,
                function(err, talks) {
                    if (err) {
                        context.message = util.inspect(err);
                        res.status(500).render("500", context);
                    }
                    context.upvoted = talks;
                    res.render("profile.upvoted.jade", context);
                });
        } else {
            res.status(404).render("404", context);
        }
    });
};

/**
 * Route /settings
 * @param req   HTTP Request object
 * @param res   HTTP Response object
 */
exports.profileFavorited = function(req, res) {
    "use strict";

    var username = req.params.username;
    var user = req.session.user;
    var context = {
        title: "tlks.io : " + username + "'s upvoted talks",
        user: user
    };
    users.getByUsername(config.mongodb, username, function(err, profile) {
        if (err) {
            context.message = util.inspect(err);
            res.status(500).render("500", context);
        }
        if (profile) {
            context.profile = profile;
            talks.getFavoritedByAuthorId(
                config.mongodb,
                profile.id,
                function(err, talks) {
                    if (err) {
                        context.message = util.inspect(err);
                        res.status(500).render("500", context);
                    }
                    context.favorited = talks;
                    res.render("profile.favorited.jade", context);
                });
        } else {
            res.status(404).render("404", context);
        }
    });
};


/**
 * Route /settings
 * @param req   HTTP Request object
 * @param res   HTTP Response object
 */
exports.settings = function(req, res) {
    "use strict";

    var user = req.session.user;
    var context = {
        title: "tlks.io : " + user.username + "'s settings",
        user: user
    };
    if (user === undefined) {
        res.status(401).send("401").end();
    } else {
        res.render('settings', context);
    }
};

/**
 * Route /settings
 * @param req   HTTP Request object
 * @param res   HTTP Response object
 */
exports.settingsSave = function(req, res) {
    "use strict";

    var user = req.session.user;
    user.bio = req.body.bio;
    user.email = req.body.email;
    user.url = req.body.url;
    users.update(config.mongodb, user, function(err) {
        if (err) {
            var context = {
                message: util.inspect(err)
            };
            res.status(500).render("500", context);
        }
        res.redirect('/');
    });
};
