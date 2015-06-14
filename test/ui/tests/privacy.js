var pageURL = 'http://tlks.io/privacy';

exports.testPrivacy = function(test) {
    'use strict';

    casper
        .start(pageURL)
        .then(function() {
            var msg = 'url is the one expected';
            test.assert(this.getCurrentUrl() === pageURL, msg);
        })
        .then(function() {
            test.assertHttpStatus(200, pageURL + ' is up');
        })
        .then(function() {
            var title = 'tlks.io : Privacy policy';
            test.assertTitle(title, 'title is the one expected');
        })
        .run(function() {
            test.done();
        });
};
