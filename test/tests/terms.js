var pageURL = "http://tlks.io/terms";

exports.testTerms = function(test) {
    casper
        .start(pageURL)
        .then(function() {
            test.assert(this.getCurrentUrl() === pageURL, 'url is the one expected');
        })
        .then(function() {
            test.assertHttpStatus(200, pageURL + ' is up');
        })
        .then(function() {
            var title = "tlks.io : Terms of service";
            test.assertTitle(title, "title is the one expected");
        })
        .run(function() {
            test.done();
        });
};
