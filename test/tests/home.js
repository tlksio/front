var pageURL = 'http://tlks.io/';

exports.testHome = function(test) {
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
            var title = 'tlks.io : A curated and community driven list of ' +
                'technical talks';
            test.assertTitle(title, 'Title is the one expected');
        })
        .then(function() {
            test.assertExists('.search-form', 'Search section exists');
        })
        .then(function() {
            test.assertExists('.latest-talks', 'Latest talks section exists');
        })
        .then(function() {
            test.assertEval(function() {
                var selector = '.latest-talks .talk';
                return __utils__.findAll(selector).length === 5;
            }, 'There are 5 latest talks listed');
        })
        .then(function() {
            var msg = 'Popular talks section exists';
            test.assertExists('.popular-talks', msg);
        })
        .then(function() {
            test.assertEval(function() {
                var selector = '.popular-talks .talk';
                return __utils__.findAll(selector).length === 5;
            }, 'There are 5 popular talks listed');
        })
        .run(function() {
            test.done();
        });
};
