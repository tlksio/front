var pageURL = "http://tlks.io/activity";

exports.testActivity = function(test) {
    casper
        .start(pageURL)
        .then(function() {
            test.assert(this.getCurrentUrl() === pageURL, 'url is the one expected');
        })
        .run(function() {
            test.done();
        });
};
