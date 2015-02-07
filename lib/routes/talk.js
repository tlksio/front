var util = require('util');
var talkModel = require('../models/talk');

/**
 * Route /talk/play/:id
 * @param req   HTTP Request object
 * @param res   HTTP Response object
 */
exports.play = function (req, res) {
    "use strict";

    var id = req.params.id;
    talkModel.play(id, function (err, talk) {
        if (err) {
            res.status(500).send("Error : " + util.inspect(err)).end();
        }
        var url = 'https://www.youtube.com/watch?v=' + talk.code;
        res.redirect(url);
    });
};

/**
 * Route /talk/:slug
 * @param req   HTTP Request object
 * @param res   HTTP Response object
 */
exports.talk = function (req, res) {
    "use strict";

    var slug = req.params.slug;
    var user = req.session.user;
    var context = {
        user: user
    };
    talkModel.getBySlug(slug, function (err, talk) {
        if (err) {
            res.status(500).send("Error : " + util.inspect(err)).end();
        }
        if (talk) {
            context.talk = talk;
            talkModel.related(talk, function (err, talks) {
                if (err) {
                    res.status(500).send("Error : " + util.inspect(err)).end();
                }
                context.related = talks;
                res.render("talk", context);
            });
        } else {
            res.status(404).send("Talk not found").end();
        }
    });
};