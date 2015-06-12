/*jshint unused:false*/
var util = require('util');

var config = require('../../config.json');
var cache = require('../cache');
var talks = require('libtlks').talk;

/**
 * Route /tag/:tag
 *
 * Renders Tag template.
 * It caches the results for 1 hour.
 *
 * @param req   HTTP Request object
 * @param res   HTTP Response object
 */
exports.tag = function(req, res) {
    'use strict';
    cache.render(req, res, function() {
        var quantity = 25;
        var page = parseInt(req.params.page || 1);
        var pagination = {
            page: page,
            next: page + 1,
            prev: (page - 1 <= 1) ? 1 : page - 1
        };
        var tag = req.params.tag;
        var user = req.session.user;
        var context = {
            title: 'tlks.io : Talks tagged as ' + tag,
            description: 'tlks.io : Talks tagged as ' + tag,
            user: user,
            tag: tag,
            page: page,
            pagination: pagination
        };
        talks.getByTag(
            config.mongodb,
            tag,
            quantity,
            page,
            function(err, results) {
                if (err) {
                    context.message = util.inspect(err);
                    res.status(500).render('500', context);
                }
                if (results.length === 0) {
                    res.status(204).end();
                    return;
                }
                context.talks = results;
                var filePath = __dirname + "/../../src/views/tag.jade";
                var html = cache.compile(req.url, filePath, context);
                res.write(html);
                res.end();
            });
    }, cache.hour1);
};
