/**
 * Route /about
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
    res.render('about', context);
};

/**
 * Route /faq
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
    res.render('faq', context);
};

/**
 * Route /contactus
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
    res.render('contactus', context);
};
