var cache = require('../cache');

/**
 * Route /privacy
 *
 * Renders Privacy template.
 *
 * @param req   HTTP Request object
 * @param res   HTTP Response object
 */
exports.privacy = function(req, res) {
    'use strict';
    var user = req.session.user;
    var context = {
        title: 'tlks.io : Privacy policy',
        user: user
    };
    var filePath = __dirname + "/../../src/views/privacy.jade";
    var html = cache.compile(req.url, filePath, context);
    res.write(html);
    res.end();
};

/**
 * Route /terms
 *
 * Renders Terms template.
 *
 * @param req   HTTP Request object
 * @param res   HTTP Response object
 */
exports.terms = function(req, res) {
    'use strict';
    var user = req.session.user;
    var context = {
        title: 'tlks.io : Terms of service',
        user: user
    };
    var filePath = __dirname + "/../../src/views/terms.jade";
    var html = cache.compile(req.url, filePath, context);
    res.write(html);
    res.end();
};
