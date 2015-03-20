var util = require('util');

var config = require('../../config.json');
var libtlks = require('libtlks');

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
        title: "tlks.io : Talks tagged as "+tag,
        user: user,
        tag: tag
    };
    libtlks.talk.getByTag(config.mongodb, tag, function (err, talks) {
        if (err) {
            context.message = util.inspect(err);
            res.status(500).render("500", context);
        }
        context.talks = talks;
        //render
        res.render('tag', context);
    });
};
