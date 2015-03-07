var util = require('util');
var slug = require('slug');
var uuid = require('uuid');
var request = require('request');

var config = require('../../config.json');
var talks = require('libtlks').talk;

/**
 * Route /search
 * @param req   HTTP Request object
 * @param req   HTTP Response object
 */
exports.search = function(req, res) {
    "use strict";

    var q = req.query.q;
    var user = req.session.user;
    var context = {
        title: "tlks.io : Search talks by '"+q+"'",
        user: user,
        q: q,
        talks: []
    };
    var url = config.elasticsearch + '/tlksio/talk/_search?q=' + q;
    request.get({
        url: url,
        method: 'GET',
        json: true
    }, function(error, response, body) {
        if (error) {
            res.status(500).send("Error : " + util.inspect(error)).end();
        }
        var hits = body.hits.hits;
        context.talks = hits.map(function(el) {
            var obj = el._source;
            obj.tags = obj.tags.split(',');
            talks.getBySlug(config.mongodb, obj.slug, function (err, talk) {
                if (err) {
                    throw new Error(err);
                }
                var t = talk[0];
                context.talks.push(t);
                return t;
            });
        });
        console.log(context.talks);
        res.render("search", context);
    });

};

/**
 * Route /talk/play/:id
 * @param req   HTTP Request object
 * @param res   HTTP Response object
 */
exports.play = function(req, res) {
    "use strict";

    var id = req.params.id;
    talks.play(config.mongodb, id, function(err, talk) {
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
exports.talk = function(req, res) {
    "use strict";

    var slug = req.params.slug;
    var user = req.session.user;
    var context = {
        user: user
    };
    talks.getBySlug(config.mongodb, slug, function(err, docs) {
        var talk = docs[0];
        if (err) {
            res.status(500).send("Error : " + util.inspect(err)).end();
        }
        if (talk) {
            context.talk = talk;
            context.title = "tlks.io : "+talk.title;
            talks.related(config.mongodb, talk, function(err, docs) {
                if (err) {
                    res.status(500).send("Error : " + util.inspect(err)).end();
                }
                context.related = docs;
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
exports.add = function(req, res) {
    "use strict";

    var user = req.session.user;
    if (user === undefined) {
        res.status(401).send("401").end();
    } else {
        var context = {
            title: "tlks.io : Add a new talk",
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
exports.save = function(req, res) {
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
        talks.createTalk(config.mongodb, talk, function(err, talk) {
            if (err) {
                res.status(500).send("Error : " + util.inspect(err)).end();
            }
            // render
            res.redirect('/');
        });
    }
};
