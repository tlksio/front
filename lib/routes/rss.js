var util = require('util');
var Feed = require('feed');

var config = require('../../config.json');
var libtlks = require('libtlks');

exports.latest = function (req, res) {
    "use strict";
    var feed = new Feed({
        title: 'Latest Talks',
        description: 'Latest Talks at tlks.io',
        link: 'http://tlks.io',
        image: 'http://tlks.io/img/favicon.png'
    });
    libtlks.talk.latest(config.mongodb, 25, function (err, talks) {
        if (err) {
            var context = {
                message: util.inspect(err)
            };
            res.status(500).render("500", context);
        }

        printRss(talks, feed, res);
    });
};

exports.popular = function (req, res) {
    "use strict";
    var feed = new Feed({
        title: 'Popular Talks',
        description: 'Popular Talks at tlks.io',
        link: 'http://tlks.io',
        image: 'http://tlks.io/img/favicon.png'
    });
    libtlks.talk.popular(config.mongodb, 25, function (err, talks) {
        if (err) {
            var context = {
                message: util.inspect(err)
            };
            res.status(500).render("500", context);
        }
        printRss(talks, feed, res);
    });
};

exports.tag = function (req, res) {
    "use strict";
    var tag = req.params.tag;
    var feed = new Feed({
        title: 'Talks tagged as '+tag,
        description: 'Talks tagged as '+tag+' at tlks.io',
        link: 'http://tlks.io',
        image: 'http://tlks.io/img/favicon.png'
    });
    libtlks.talk.getByTag(config.mongodb, tag, function (err, talks) {
        if (err) {
            var context = {
                message: util.inspect(err)
            };
            res.status(500).render("500", context);
        }
        printRss(talks, feed, res);
    });
};

function printRss(talks, feed, res) {
    talks.forEach(function (el) {
        feed.addItem({
            title:  el.title,
            link: 'http://tlks.io/talk/' + el.code,
            content: el.description,
            date: new Date(el.created),
            image: "http://img.youtube.com/vi/" + el.code + "/0.jpg",
        });
    });
    res.set('Content-Type', 'text/xml');
    res.send(feed.render('rss-2.0'));
}
