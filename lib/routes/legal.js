/**
 * Route /privacy
 * @param req   HTTP Request object
 * @param res   HTTP Response object
 */
exports.privacy = function(req, res) {
    "use strict";

    var user = req.session.user;
    var context = {
        title: "tlks.io : Privacy policy",
        user: user
    };
    res.render('privacy', context);
};

/**
 * Route /terms
 * @param req   HTTP Request object
 * @param res   HTTP Response object
 */
exports.terms = function(req, res) {
    "use strict";

    var user = req.session.user;
    var context = {
        title: "tlks.io : Terms of service",
        user: user
    };
    res.render('terms', context);
};
