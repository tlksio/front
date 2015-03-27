var pageURL = "http://tlks.io/auth/login";

exports.testLogin = function(test) {
    casper
        .start(pageURL)
        .then(function() {
            test.assert(this.getCurrentUrl() === pageURL, 'url is the one expected');
        })
        .then(function() {
            test.assertHttpStatus(200, pageURL + ' is up');
        })
        .then(function() {
            var title = "tlks.io : Sign in";
            test.assertTitle(title, "title is the one expected");
        })
        .run(function() {
            test.done();
        });
};
