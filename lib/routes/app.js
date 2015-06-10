var cache = require('../cache');

/**
 * Route /about
 * @param req   HTTP Request object
 * @param res   HTTP Response object
 */
exports.about = function(req, res) {
    'use strict';
    cache.render(req, res, function() {
        var user = req.session.user;
        var context = {
            title: 'tlks.io : About',
            user: user
        };
        var filePath = __dirname + "/../../src/views/about.jade";
        var html = cache.compile(req.url, filePath, context);
        res.write(html);
        res.end();
    }, (1000*60*5));
};

/**
 * Route /faq
 * @param req   HTTP Request object
 * @param res   HTTP Response object
 */
exports.faq = function(req, res) {
    'use strict';
    cache.render(req, res, function() {
        var user = req.session.user;
        var context = {
            title: 'tlks.io : Frequently Asked Questions',
            user: user
        };
        var filePath = __dirname + "/../../src/views/faq.jade";
        var html = cache.compile(req.url, filePath, context);
        res.write(html);
        res.end();
    }, (1000*60*5));
};

/**
 * Route /contactus
 * @param req   HTTP Request object
 * @param res   HTTP Response object
 */
exports.contactus = function(req, res) {
    'use strict';
    cache.render(req, res, function() {
        var user = req.session.user;
        var context = {
            title: 'tlks.io : Contact Us',
            user: user
        };
        var filePath = __dirname + "/../../src/views/contactus.jade";
        var html = cache.compile(req.url, filePath, context);
        res.write(html);
        res.end();
    }, (1000*60*5));

};
