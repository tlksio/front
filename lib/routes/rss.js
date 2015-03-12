var util = require('util');
var Feed = require('feed');

var config = require('../../config.json');
var libtlks = require('libtlks');

exports.latest = function (req, res) {
    "use strict";
    var feed = new Feed({
        title: 'Latest Talks',
        description: 'Latest Talks at techtalks.io',
        link: 'http://vps129914.ovh.net',
        image: 'http://vps129914.ovh.net/img/favicon.png'
    });
    libtlks.talk.latest(config.mongodb, 25, function (err, talks) {
        if (err) {
            res.status(500).send("Error : " + util.inspect(err)).end();
        }

        printRss(talks, feed, res);
    });
};

exports.popular = function (req, res) {
    "use strict";
    var feed = new Feed({
        title: 'Popular Talks',
        description: 'Popular Talks at techtalks.io',
        link: 'http://vps129914.ovh.net',
        image: 'http://vps129914.ovh.net/img/favicon.png'
    });
    libtlks.talk.popular(config.mongodb, 25, function (err, talks) {
        if (err) {
            res.status(500).send("Error : " + util.inspect(err)).end();
        }
        printRss(talks, feed, res);
    });
};

exports.tag = function (req, res) {
    "use strict";
    var tag = req.params.tag;
    var feed = new Feed({
        title: 'Talks tagged as '+tag,
        description: 'Talks tagged as '+tag+' at techtalks.io',
        link: 'http://vps129914.ovh.net',
        image: 'http://vps129914.ovh.net/img/favicon.png'
    });
    libtlks.talk.getByTag(config.mongodb, tag, function (err, talks) {
        if (err) {
            res.status(500).send("Error : " + util.inspect(err)).end();
        }
        printRss(talks, feed, res);
    });
};

function printRss(talks, feed, res) {
    talks.forEach(function (el) {
        feed.addItem({
            title:  el.title,
            link: 'http://vps129914.ovh.net/talk/' + el.code,
            content: el.description,
            date: new Date(el.created),
            image: "http://img.youtube.com/vi/" + el.code + "/0.jpg",
        });
    });
    res.set('Content-Type', 'text/xml');
    res.send(feed.render('rss-2.0'));
}
