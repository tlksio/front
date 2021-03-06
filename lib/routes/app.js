var cache = require('../cache');

/**
 * Route /about
 *
 * Renders about template.
 * It caches the result for 1 hour.
 *
 * @param req   HTTP Request object
 * @param res   HTTP Response object
 */
exports.about = function(req, res) {
    'use strict';
    var user = req.session.user;
    var context = {
        title: 'tlks.io : About',
        user: user
    };
    var filePath = __dirname + "/../../src/views/about.jade";
    var html = cache.compile(req.url, filePath, context);
    if (user === undefined) {
        cache.save(req.url, html);
    }
    res.write(html);
    res.end();
};

/**
 * Route /faq
 *
 * Renders FAQ template.
 * It caches the result for 1 hour.
 *
 * @param req   HTTP Request object
 * @param res   HTTP Response object
 */
exports.faq = function(req, res) {
    'use strict';
    var user = req.session.user;
    var context = {
        title: 'tlks.io : Frequently Asked Questions',
        user: user
    };
    var filePath = __dirname + "/../../src/views/faq.jade";
    var html = cache.compile(req.url, filePath, context);
    if (user === undefined) {
        cache.save(req.url, html);
    }
    res.write(html);
    res.end();
};

/**
 * Route /contactus
 *
 * Renders Contact Us template.
 * It caches the result for 1 hour.
 *
 * @param req   HTTP Request object
 * @param res   HTTP Response object
 */
exports.contactus = function(req, res) {
    'use strict';
    var user = req.session.user;
    var context = {
        title: 'tlks.io : Contact Us',
        user: user
    };
    var filePath = __dirname + "/../../src/views/contactus.jade";
    var html = cache.compile(req.url, filePath, context);
    if (user === undefined) {
        cache.save(req.url, html);
    }
    res.write(html);
    res.end();
};
