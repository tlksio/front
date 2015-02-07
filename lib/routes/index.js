var oauth = require('oauth');
var uuid = require('uuid');
var slug = require('slug');
var util = require('util');

var config = require('../../config.json');
var talkModel = require('../models/talk');
var userModel = require('../models/user');

var consumer = new oauth.OAuth(
    "https://twitter.com/oauth/request_token",
    "https://twitter.com/oauth/access_token",
    config.twitterConsumerKey,
    config.twitterConsumerSecret,
    "1.0A",
    config.twitter_callback_url,
    "HMAC-SHA1"
);

exports.index = function (req, res) {
    "use strict";

    var user = req.session.user;
    var context = {
        user: user
    };
    talkModel.latest(5, function (err, talks) {
        if (err) {
            res.status(500).send("Error : " + util.inspect(err)).end();
        }
        context.latest = talks;
        talkModel.popular(5, function (err, talks) {
            if (err) {
                res.status(500).send("Error : " + util.inspect(err)).end();
            }
            context.popular = talks;
            res.render('index', context);
        });
    });
};

exports.privacy = function (req, res) {
    "use strict";

    var user = req.session.user;
    var context = {
        user: user
    };
    res.render('privacy', context);
};

exports.terms = function (req, res) {
    "use strict";

    var user = req.session.user;
    var context = {
        user: user
    };
    res.render('terms', context);
};

exports.about = function (req, res) {
    "use strict";

    var user = req.session.user;
    var context = {
        user: user
    };
    res.render('about', context);
};

exports.faq = function (req, res) {
    "use strict";

    var user = req.session.user;
    var context = {
        user: user
    };
    res.render('faq', context);
};

exports.login = function (req, res) {
    "use strict";

    var user = req.session.user;
    var context = {
        user: user
    };
    res.render('login', context);
};

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
            author: { id: user.id, username: user.screen_name, avatar: user.avatar },
            "viewCount": 0,
            "voteCount": 0,
            "votes": [],
            "favoriteCount": 0,
            "favorites": [],
            "tags": [],
            "created": Date.now(),
            "updated": Date.now()
        };
        // create talk
        talk.create(talk, function (err, talk) {
            if (err) {
                res.status(500).send("Error : " + util.inspect(err)).end();
            }
            // render
            res.redirect('/');
        });
    }
};

exports.profile = function (req, res) {
    "use strict";

    var user = req.session.user;
    var context = {
        user: user
    };
    if (user === undefined) {
        res.status(401).send("401").end();
    } else {
        res.render('profile', context);
    }
};

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

exports.authLogout = function (req, res) {
    "use strict";

    req.session.user = undefined;
    res.redirect('/');
};

exports.authTwitter = function (req, res) {
    "use strict";

    consumer.getOAuthRequestToken(function (error, oauthToken, oauthTokenSecret, results) {
        if (error) {
            res.send("Error getting OAuth request token : " + util.inspect(error), 500);
        } else {
            req.session.oauthRequestToken = oauthToken;
            req.session.oauthRequestTokenSecret = oauthTokenSecret;
            res.redirect("https://twitter.com/oauth/authorize?oauth_token=" + req.session.oauthRequestToken);
        }
    });
};

exports.authTwitterCallback = function (req, res) {
    "use strict";

    // util.puts(">> Request Token : " + req.session.oauthRequestToken);
    // util.puts(">> Request Token Secret : " + req.session.oauthRequestTokenSecret);
    // util.puts(">> OAuth Verifier : " + req.query.oauth_verifier);
    consumer.getOAuthAccessToken(
        req.session.oauthRequestToken,
        req.session.oauthRequestTokenSecret,
        req.query.oauth_verifier,
        function (error, oauthAccessToken, oauthAccessTokenSecret, results) {
            if (error) {
                var msg = "Error getting OAuth access token : ";
                msg += util.inspect(error);
                msg += "[ oauthAccessToken : " + oauthAccessToken + "]";
                msg += "[ oauthAccessTokenSecret : " + oauthAccessTokenSecret + "]";
                msg += "[ results : " + util.inspect(results) + "]";
                res.status(500).send(msg).end();
            } else {
                req.session.user = results;
                req.session.oauthAccessToken = oauthAccessToken;
                req.session.oauthAccessTokenSecret = oauthAccessTokenSecret;

                consumer.get(
                    "https://api.twitter.com/1.1/account/verify_credentials.json",
                    req.session.oauthAccessToken,
                    req.session.oauthAccessTokenSecret, function (error, data, response) {
                        if (error) {
                            res.status(500).send("Error getting twitter screen name : " + util.inspect(error)).end();
                        } else {
                            var parsedData = JSON.parse(data);
                            req.session.user.id = parsedData.id;
                            req.session.user.avatar = parsedData.profile_image_url;
                            var user = {
                                id: uuid.v1(),
                                avatar: parsedData.profile_image_url,
                                username: parsedData.screen_name,
                                bio: parsedData.bio,
                                twitterId: parsedData.id,
                                created: Date.now(),
                                updated: Date.now()
                            };
                            console.log(user);
                            res.redirect('/');
                        }
                    }
                );
            }
        }
    );
};

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

exports.publicProfile = function (req, res) {
    "use strict";

    var username = req.params.username;
    var user = req.session.user;
    var context = {
        user: user
    };
    userModel.profile(username, function (err, profile) {
        if (err) {
            res.status(500).send("Error : " + util.inspect(err)).end();
        }
        if (profile) {
            context.profile = profile;
            res.render("public_profile.jade", context);
        } else {
            res.status(404).send("User not found").end();
        }
    });
};

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
