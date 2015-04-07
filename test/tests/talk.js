/*jshint scripturl:true*/
var pageURL = 'http://tlks.io/talk/javascript-the-good-parts';

exports.testTalk = function(test) {
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
            var title = 'JavaScript: The Good Parts | tlks.io';
            test.assertTitle(title, 'title is the one expected');
        })
        .run(function() {
            test.done();
        });
};
