var pageURL = "http://tlks.io/talk/javascript-the-good-parts";

exports.testTalk = function(test) {
    casper
        .start(pageURL)
        .then(function() {
            test.assert(this.getCurrentUrl() === pageURL, 'url is the one expected');
        })
        .then(function() {
            test.assertHttpStatus(200, pageURL + ' is up');
        })
        .then(function() {
            var title = "JavaScript: The Good Parts | tlks.io";
            test.assertTitle(title, "title is the one expected");
        })
        .run(function() {
            test.done();
        });
};
