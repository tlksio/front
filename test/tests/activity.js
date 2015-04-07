var pageURL = 'http://tlks.io/activity';

exports.testActivity = function(test) {
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
            var title = 'tlks.io : Recent activity log';
            test.assertTitle(title, 'title is the on expected');
        })
        .run(function() {
            test.done();
        });
};
