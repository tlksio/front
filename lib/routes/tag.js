var util = require('util');

var config = require('../../config.json');
var libtlks = require('libtlks');

/**
 * Route /tag/:tag
 * @param req   HTTP Request object
 * @param res   HTTP Response object
 */
exports.tag = function(req, res) {
    "use strict";

    var quantity = 25;
    var page = parseInt(req.params.page || 1);
    var pagination = {
        next: page + 1,
        prev: (page - 1 <= 1) ? 1 : page - 1
    };
    var tag = req.params.tag;
    var user = req.session.user;
    var context = {
        title: "tlks.io : Talks tagged as " + tag,
        description: "tlks.io : Talks tagged as " + tag,
        user: user,
        tag: tag,
        page: page,
        pagination: pagination
    };
    libtlks.talk.getByTag(
        config.mongodb,
        tag,
        quantity,
        page,
        function(err, talks) {
            if (err) {
                context.message = util.inspect(err);
                res.status(500).render("500", context);
            }
            if (talks.length === 0) {
                res.status(204).end();
                return;
            }
            context.talks = talks;
            //render
            res.render('tag', context);
        });
};
