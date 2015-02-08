var util = require('util');

var talkModel = require('../models/talk');

/**
 * Route /tag/:tag
 * @param req   HTTP Request object
 * @param res   HTTP Response object
 */
exports.tag = function (req, res) {
    "use strict";

    var tag = req.params.tag;
    var user = req.session.user;
    var context = {
        user: user,
        tag: tag
    };
    talkModel.getByTag(tag, function (err, talks) {
        if (err) {
            res.status(500).send("Error : " + util.inspect(err)).end();
        }
        context.talks = talks;
        //render
        res.render('tag', context);
    });
};