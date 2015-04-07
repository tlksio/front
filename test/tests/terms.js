var pageURL = 'http://tlks.io/terms';

exports.testTerms = function(test) {
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
            var title = 'tlks.io : Terms of service';
            test.assertTitle(title, 'title is the one expected');
        })
        .run(function() {
            test.done();
        });
};
