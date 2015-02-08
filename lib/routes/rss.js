var util = require('util');
var Feed = require('feed');

var talkModel = require('../models/talk');

exports.latest = function (req, res) {
    "use strict";
    var feed = new Feed({
        title: 'Latest Talks',
        description: 'Latest Talks at techtalks.io',
        link: 'http://vps129914.ovh.net',
        image: 'http://vps129914.ovh.net/img/favicon.png'
    });
    talkModel.latest(25, function (err, talks) {
        if (err) {
            res.status(500).send("Error : " + util.inspect(err)).end();
        }
        talks.forEach(function (el) {
            feed.addItem({
                title: el.title,
                link: 'http://vps129914.ovh.net/talk/' + el.code,
                content: el.description,
                date: new Date(el.created),
                image: "http://img.youtube.com/vi/" + el.code + "/0.jpg"
            });
        });
        res.set('Content-Type', 'text/xml');
        res.send(feed.render('rss-2.0'));
    });
};

exports.popular = function (req, res) {
    "use strict";
    talkModel.popular(25, function (err, talks) {
        if (err) {
            res.status(500).send("Error : " + util.inspect(err)).end();
        }

    });
};