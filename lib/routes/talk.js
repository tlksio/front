/*jshint unused:false*/
var slug = require('slug');
var uuid = require('uuid');
var moment = require('moment');
var request = require('request');
var https = require('https');
var url = require('url');
var cache = require('../cache');
var video = require('../video');

var async = require('async');

var config = require('../../config.json');
var talks = require('libtlks').talk;
var users = require('libtlks').user;
var utils = require('../utils');

/**
 * Route /search
 *
 * Renders Search template.
 * It caches the result for 5 minutes.
 *
 * @param req   HTTP Request object
 * @param req   HTTP Response object
 */
exports.search = function(req, res, next) {
    'use strict';
    var q = req.query.q;
    var user = req.session.user;
    var context = {
        title: 'Tech talks by \'' + q + '\'' + ' | tlks.io',
        description: 'Tech talks by \'' + q + '\'' + ' | tlks.io',
        user: user,
        q: q,
        talks: []
    };
    talks.search(q, function(err, response) {
        console.log(q);
        console.log("--------");

        if (err) {
            return next(err);
        }
        /*
        var hits = body.hits.hits;
        async.map(hits, function(el, callback) {
            var obj = el._source;
            obj.tags = obj.tags.split(',').map(function(el) {
                return el.trim();
            });
            talks.getBySlug(config.mongodb, obj.slug, function(err, talks) {
                if (err) {
                    return next(err);
                }
                callback(null, talks[0]);
            });
        }, function(err, results) {
            if (err) {
                return next(err);
            }
            context.talks = results;
            var filePath = __dirname + "/../../src/views/search.jade";
            var html = cache.compile(req.url, filePath, context);
            if (user === undefined) {
                cache.save(req.url, html);
            }
            res.write(html);
            res.end();
        });
        */
        res.end();
    });
};

/**
 * Route /talk/play/:id
 *
 * Plays a talk by its slug field.
 *
 * @param req   HTTP Request object
 * @param res   HTTP Response object
 */
exports.play = function(req, res) {
    'use strict';
    var slug = req.params.slug;
    talks.play(config.mongodb, slug, function(err, talk) {
        if (err) {
            return next(err);
        }
        var url;
        if (talk.type === "vimeo") {
            url = 'https://vimeo.com/' + talk.code;
        } else {
            url = 'https://www.youtube.com/watch?v=' + talk.code;
        }
        res.redirect(url);
    });
};

/**
 * Route /talk/upvote/:id
 *
 * Upvotes a talk by its ID.
 *
 * @param req   HTTP Request object
 * @param res   HTTP Response object
 */
exports.upvote = function(req, res, next) {
    'use strict';

    var id = req.params.id;
    var user = req.session.user;
    if (user === undefined) {
        var err = {
            status: 401,
            message: 'Unauthorized'
        };
        return next(err);
    } else {
        var userid = user.id;
        talks.upvote(config.mongodb, id, userid, function(err, updated) {
            if (err) {
                return next(err);
            }
            var result = {
                'result': updated ? true : false
            };
            res.send(result);
        });
    }
};

/**
 * Route /talk/favorite/:id
 *
 * Favorites a talk by its ID.
 *
 * @param req   HTTP Request object
 * @param res   HTTP Response object
 */
exports.favorite = function(req, res, next) {
    'use strict';

    var id = req.params.id;
    var user = req.session.user;
    if (user === undefined) {
        var err = {
            status: 401,
            message: 'Unauthorized'
        };
        return next(err);
    } else {
        var userid = user.id;
        talks.favorite(config.mongodb, id, userid, function(err, updated) {
            if (err) {
                return next(err);
            }
            var result = {
                'result': updated ? true : false
            };
            res.send(result);
        });
    }
};

/**
 * Route /talk/unfavorite/:id
 *
 * Unfavorite a talk by its ID.
 *
 * @param req   HTTP Request object
 * @param res   HTTP Response object
 */
exports.unfavorite = function(req, res, next) {
    'use strict';

    var id = req.params.id;
    var user = req.session.user;
    if (user === undefined) {
        var err = {
            status: 401,
            message: 'Unauthorized'
        };
        return next(err);
    } else {
        var userid = user.id;
        talks.unfavorite(config.mongodb, id, userid, function(err, updated) {
            if (err) {
                return next(err);
            }
            var result = {
                'result': updated ? true : false
            };
            res.send(result);
        });
    }
};

/**
 * Route /talk/:slug
 *
 * Renders detailed talk template.
 * It caches the result for 5 minutes.
 *
 * @param req   HTTP Request object
 * @param res   HTTP Response object
 */
exports.talk = function(req, res) {
    'use strict';
    var slug = req.params.slug;
    var user = req.session.user;
    var context = {
        user: user,
        moment: moment
    };
    talks.getBySlug(config.mongodb, slug, function(err, docs) {
        var talk = docs[0];
        if (err) {
            return next(err);
        }
        if (talk) {
            context.talk = talk;
            context.title = talk.title + ' | tlks.io';
            context.description = talk.description.substring(0, 200);
            talks.related(
                config.mongodb,
                talk.id,
                talk.tags,
                5,
                function(err, docs) {
                    if (err) {
                        return next(err);
                    }
                    context.related = docs;

                    var userList = [];
                    users.getByIdentifiers(
                        config.mongodb,
                        talk.votes,
                        function(err, votes) {
                            votes.forEach(function(user) {
                                userList.push(user);
                            });
                            context.voters = userList;
                            var filePath = __dirname;
                            filePath += "/../../src/views/";
                            filePath += "talk.jade";
                            var html = cache.compile(req.url,
                                filePath,
                                context);
                            if (user === undefined) {
                                cache.save(req.url, html);
                            }
                            res.write(html);
                            res.end();
                        }
                    );
                });
        } else {
            res.status(404).render('404', context);
        }
    });
};

/**
 * Route /add
 *
 * Renders Add Talk template.
 *
 * @param req   HTTP Request object
 * @param res   HTTP Response object
 */
exports.add = function(req, res) {
    'use strict';

    var user = req.session.user;
    if (user === undefined) {
        res.status(401).send('401').end();
    } else {
        var context = {
            title: 'tlks.io : Add a new talk',
            user: user,
            csrfToken: req.csrfToken()
        };
        res.render('add', context);
    }
};

/**
 * Route /save
 *
 * Save a talk to the database.
 *
 * @param req   HTTP Request object
 * @param res   HTTP Response object
 */
exports.save = function(req, res, next) {
    'use strict';

    function getVimeoThumbnail(code, talk, callback) {
        var url = "https://vimeo.com/api/v2/video/" +
            code + ".json";
        https.get(url, function(responseVimeo) {
            var body = '';
            responseVimeo.on('data', function(chunk) {
                body += chunk;
            });

            /*jshint camelcase: false */
            responseVimeo.on('end', function() {
                talk.thumb = JSON.parse(body)[0].thumbnail_medium;

                callback(talk);
            });
        }).on('error', function(e) {
            console.log("Got error: " + e.message);
        });
    }

    function createTalk(talk) {
        talks.createTalk(config.mongodb, talk, function(err, talk) {
            if (err) {
                return next(err);
            }
            // render
            res.redirect('/');
        });
    }

    // user
    var user = req.session.user;
    if (user === undefined) {
        var err = {
            status: 401,
            message: 'Unauthorized'
        };
        return next(err);
    } else {
        var parts = video.getCodeAndTypeFromRequest(req.body.code);
        var code = parts[0];
        var type = parts[1];

        talks.getByCode(config.mongodb, code, function(err, docs) {
            var talk = docs[0];
            if (err) {
                return next(err);
            }
            if (talk) {
                res.redirect(301, "/talk/" + talk.slug);
            } else {
                var description = utils.nl2br(req.body.description);
                talk = {
                    id: uuid.v1(),
                    code: code,
                    title: req.body.title,
                    slug: slug(req.body.title).toLowerCase(),
                    description: description,
                    author: {
                        id: user.id,
                        username: user.username,
                        avatar: user.avatar
                    },
                    'viewCount': 0,
                    'voteCount': 0,
                    'votes': [],
                    'favoriteCount': 0,
                    'favorites': [],
                    'tags': utils.uniq(req.body.tags.split(',')
                        .map(function(el) {
                            return el.trim().toLowerCase();
                        })),
                    'created': Date.now(),
                    'updated': Date.now(),
                    'type': type
                };

                if (type === "vimeo") {
                    getVimeoThumbnail(code, talk, createTalk);
                } else {
                    createTalk(talk);
                }
            }
        });
    }
};

/**
 * Route /popular
 *
 * Renders Popular template.
 * It caches the result for 1 hour.
 *
 * @param req   HTTP Request object
 * @param res   HTTP Response object
 */
exports.popular = function(req, res) {
    'use strict';
    var quantity = 25;
    var page = parseInt(req.params.page || 1);
    var pagination = {
        page: page,
        next: page + 1,
        prev: (page - 1 <= 1) ? 1 : page - 1
    };
    var user = req.session.user;
    var context = {
        title: 'tlks.io : Popular talks',
        user: user,
        page: page,
        pagination: pagination
    };
    talks.popular(config.mongodb, quantity, page, function(err, talks) {
        if (err) {
            return next(err);
        }
        if (talks.length === 0) {
            res.status(204).end();
            return;
        }
        context.latest = talks;
        var filePath = __dirname + "/../../src/views/popular.jade";
        var html = cache.compile(req.url, filePath, context);
        if (user === undefined) {
            cache.save(req.url, html);
        }
        res.write(html);
        res.end();
    });
};

/**
 * Route /latest
 *
 * Renders Latest template.
 * It caches the result for 1 hour.
 *
 * @param req   HTTP Request object
 * @param res   HTTP Response object
 */
exports.latest = function(req, res) {
    'use strict';
    var quantity = 25;
    var page = parseInt(req.params.page || 1);
    var pagination = {
        page: page,
        next: page + 1,
        prev: (page - 1 <= 1) ? 1 : page - 1
    };
    var user = req.session.user;
    var context = {
        title: 'tlks.io : Latest talks',
        user: user,
        page: page,
        pagination: pagination
    };
    talks.latest(config.mongodb, quantity, page, function(err, talks) {
        if (err) {
            return next(err);
        }
        if (talks.length === 0) {
            res.status(204).end();
            return;
        }
        context.latest = talks;
        var filePath = __dirname + "/../../src/views/latest.jade";
        var html = cache.compile(req.url, filePath, context);
        if (user === undefined) {
            cache.save(req.url, html);
        }
        res.write(html);
        res.end();
    });
};
