var util = require('util');
var slug = require('slug');
var uuid = require('uuid');
var request = require('request');

var async = require('async');

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
        title: "Tech talks by '" + q + "'" + " | tlks.io",
        description: "Tech talks by '" + q + "'" + " | tlks.io",
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
            context.message = util.inspect(err);
            res.status(500).render("500", context);
        }
        var hits = body.hits.hits;
        async.map(hits, function(el, callback) {
            var obj = el._source;
            obj.tags = obj.tags.split(',').map(function(el) {
                return el.trim();
            });
            talks.getBySlug(config.mongodb, obj.slug, function(err, talks) {
                if (err) {
                    context.message = util.inspect(err);
                    res.status(500).render("500", context);
                }
                callback(null, talks[0]);
            });
        }, function(err, results) {
            if (err) {
                context.message = util.inspect(err);
                res.status(500).render("500", context);
            }
            context.talks = results;
            res.render("search", context);
        });
    });
};

/**
 * Route /talk/play/:id
 * @param req   HTTP Request object
 * @param res   HTTP Response object
 */
exports.play = function(req, res) {
    "use strict";

    var slug = req.params.slug;
    talks.play(config.mongodb, slug, function(err, talk) {
        if (err) {
            var context = {
                message: util.inspect(err)
            };
            res.status(500).render("500", context);
        }
        var url = 'https://www.youtube.com/watch?v=' + talk.code;
        res.redirect(url);
    });
};

/**
 * Route /talk/upvote/:id
 * @param req   HTTP Request object
 * @param res   HTTP Response object
 */
exports.upvote = function(req, res) {
    "user strict";
    var id = req.params.id;
    var user = req.session.user;
    if (user === undefined) {
        res.status(401).send("401").end();
    } else {
        var userid = user.id;
        talks.upvote(config.mongodb, id, userid, function(err, updated) {
            if (err) {
                var context = {
                    message: util.inspect(err)
                };
                res.status(500).render("500", context);
            }
            var result = {
                "result": updated ? true : false
            };
            res.send(result);
        });
    }
};

/**
 * Route /talk/favorite/:id
 * @param req   HTTP Request object
 * @param res   HTTP Response object
 */
exports.favorite = function(req, res) {
    "user strict";
    var id = req.params.id;
    var user = req.session.user;
    if (user === undefined) {
        res.status(401).send("401").end();
    } else {
        var userid = user.id;
        talks.favorite(config.mongodb, id, userid, function(err, updated) {
            if (err) {
                var context = {
                    message: util.inspect(err)
                };
                res.status(500).render("500", context);
            }
            var result = {
                "result": updated ? true : false
            };
            res.send(result);
        });
    }
};

/**
 * Route /talk/unfavorite/:id
 * @param req   HTTP Request object
 * @param res   HTTP Response object
 */
exports.unfavorite = function(req, res) {
    "user strict";
    var id = req.params.id;
    var user = req.session.user;
    if (user === undefined) {
        res.status(401).send("401").end();
    } else {
        var userid = user.id;
        talks.unfavorite(config.mongodb, id, userid, function(err, updated) {
            if (err) {
                var context = {
                    message: util.inspect(err)
                };
                res.status(500).render("500", context);
            }
            var result = {
                "result": updated ? true : false
            };
            res.send(result);
        });
    }
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
            context.message = util.inspect(err);
            res.status(500).render("500", context);
        }
        if (talk) {
            context.talk = talk;
            context.title =  talk.title + " | tlks.io";
            context.description = talk.description.substring(0,200);
            talks.related(config.mongodb, talk.id, talk.tags, 5, function(err, docs) {
                if (err) {
                    context.message = util.inspect(err);
                    res.status(500).render("500", context);
                }
                context.related = docs;
                res.render("talk", context);
            });
        } else {
            res.status(404).render("404", context);
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
            "tags": req.body.tags.split(',').map(function(el) {
                return el.trim().toLowerCase();
            }),
            "created": Date.now(),
            "updated": Date.now()
        };
        // create talk
        talks.createTalk(config.mongodb, talk, function(err, talk) {
            if (err) {
                var context = {
                    message: util.inspect(err)
                };
                res.status(500).render("500", context);
            }
            // render
            res.redirect('/');
        });
    }
};
