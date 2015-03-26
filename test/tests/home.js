var pageURL = "http://tlks.io/";

exports.testHome = function(test) {
    casper
        .start(pageURL)
        .then(function() {
            test.assert(this.getCurrentUrl() === pageURL, 'url is the one expected');
        })
        .then(function() {
            test.assertHttpStatus(200, pageURL + ' is up');
        })
        .then(function() {
            var title = "tlks.io : A curated and community driven list of technical talks";
            test.assertTitle(title, "Title is the one expected");
        })
        .run(function() {
            test.done();
        });
};
