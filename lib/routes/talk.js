var util = require('util');
var slug = require('slug');
var uuid = require('uuid');

var config = require('../../config.json');
var libtlks = require('libtlks');

/**
 * Route /search
 * @param req   HTTP Request object
 * @param req   HTTP Response object
 */
exports.search = function (req, res) {
    "use strict";

    var q = req.query.q;
    var user = req.session.user;
    var context = {
        user: user,
        q: q
    };
    console.log(q);
    console.log(config.index);
    console.log(__dirname);
    var path = '/home/raul/Projects/tlks.io/index/data';
    libtlks.talk.search(path, q, function (err, results) {
        if (err) {
            res.status(500).send("Error : " + util.inspect(err)).end();
        }
        console.log(results);
        context.talks = results;
        res.render("search", context);
    });
};

/**
 * Route /talk/play/:id
 * @param req   HTTP Request object
 * @param res   HTTP Response object
 */
exports.play = function (req, res) {
    "use strict";

    var id = req.params.id;
    libtlks.talk.play(config.mongodb, id, function (err, talk) {
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
    libtlks.talk.getBySlug(config.mongodb, slug, function (err, talks) {
        var talk = talks[0];
        if (err) {
            res.status(500).send("Error : " + util.inspect(err)).end();
        }
        if (talk) {
            context.talk = talk;
            libtlks.talk.related(config.mongodb, talk, function (err, talks) {
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

/**
 * Route /add
 * @param req   HTTP Request object
 * @param res   HTTP Response object
 */
exports.add = function (req, res) {
    "use strict";

    var user = req.session.user;
    if (user === undefined) {
        res.status(401).send("401").end();
    } else {
        var context = {
            user: user
        };
        res.render('add', context);
    }
};

/**
 * Route /save
 * @param req   HTTP Request object
 * @param res   HTTP Response object
 */
exports.save = function (req, res) {
    "use strict";

    // user
    var user = req.session.user;
    if (user === undefined) {
        res.status(401).send("401").end();
    } else {
        // talk
        var talk = {
            id: uuid.v1(),
            code: req.body.code,
            title: req.body.title,
            slug: slug(req.body.title).toLowerCase(),
            description: req.body.description,
            author: {
                id: user.id,
                username: user.username,
                avatar: user.avatar
            },
            "viewCount": 0,
            "voteCount": 0,
            "votes": [],
            "favoriteCount": 0,
            "favorites": [],
            "tags": req.body.tags.split(','),
            "created": Date.now(),
            "updated": Date.now()
        };
        // create talk
        libtlks.talk.createTalk(config.mongodb, talk, function (err, talk) {
            if (err) {
                res.status(500).send("Error : " + util.inspect(err)).end();
            }
            // render
            res.redirect('/');
        });
    }
};
