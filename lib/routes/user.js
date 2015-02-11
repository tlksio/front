var util = require('util');

var userModel = require('../models/user');
var talkModel = require('../models/talk');

/**
 * Route /profile
 * @param req   HTTP Request object
 * @param res   HTTP Response object
 */
exports.profile = function (req, res) {
    "use strict";

    var username = req.params.username;
    var user = req.session.user;
    var context = {
        user: user
    };
    userModel.getByUsername(username, function (err, profile) {
        if (err) {
            res.status(500).send("Error : " + util.inspect(err)).end();
        }
        if (profile) {
            context.profile = profile;
            console.log(profile.id);
            talkModel.getByAuthorId(profile.id, function (err, talks) {
                if (err) {
                    res.status(500).send("Error : " + util.inspect(err)).end();
                }
                context.posted = talks;
                res.render("profile.jade", context);
            });
        } else {
            res.status(404).send("User not found").end();
        }
    });
};

/**
 * Route /settings
 * @param req   HTTP Request object
 * @param res   HTTP Response object
 */
exports.settings = function (req, res) {
    "use strict";

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

exports.settingsSave = function (req, res) {
    "use strict";

    var user = req.session.user;
    user.bio = req.body.bio;
    user.email = req.body.email;
    userModel.update(user, function (err) {
        if (err) {
            res.status(500).send("Error : " + util.inspect(err)).end();
        }
        res.redirect('/');
    });
};