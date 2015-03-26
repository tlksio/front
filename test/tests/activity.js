var pageURL = "http://tlks.io/activity";

exports.testActivity = function(test) {
    casper
        .start(pageURL)
        .then(function() {
            test.assert(this.getCurrentUrl() === pageURL, 'url is the one expected');
        })
        .then(function() {
            test.assertHttpStatus(200, pageURL + ' is up');
        })
        .then(function() {
            var title = "tlks.io : Recent activity log";
            test.assertTitle(title, "title is the on expected");
        })
        .run(function() {
            test.done();
        });
};
