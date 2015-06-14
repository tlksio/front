var pageURL = 'http://tlks.io/auth/login';

exports.testLogin = function(test) {
    'use strict';

    casper
        .start(pageURL)
        .then(function() {
            var msg = 'url is the one expeced';
            test.assert(this.getCurrentUrl() === pageURL, msg);
        })
        .then(function() {
            test.assertHttpStatus(200, pageURL + ' is up');
        })
        .then(function() {
            var title = 'tlks.io : Sign in';
            test.assertTitle(title, 'title is the one expected');
        })
        .run(function() {
            test.done();
        });
};
