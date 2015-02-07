/**
 * Route /about
 * @param req   HTTP Request object
 * @param res   HTTP Response object
 */
exports.about = function (req, res) {
    "use strict";

    var user = req.session.user;
    var context = {
        user: user
    };
    res.render('about', context);
};

/**
 * Route /faq
 * @param req   HTTP Request object
 * @param res   HTTP Response object
 */
exports.faq = function (req, res) {
    "use strict";

    var user = req.session.user;
    var context = {
        user: user
    };
    res.render('faq', context);
};