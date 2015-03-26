// http://tlks.io/
casper.test.begin('Testing tlks.io UI', 2, function(test) {

    var pageURL = "http://tlks.io/";

    casper.start(pageURL);

    casper.then(function() {
        this.test.assert(this.getCurrentUrl() === pageURL, 'url is the one expected');
    });

    casper.then(function() {
        this.test.assertHttpStatus(200, pageURL + ' is up');
    });

    casper.run(function() {
        this.test.done();
    });

});

// http://tlks.io/about
casper.test.begin('Testing tlks.io : About UI', 2, function(test) {

    var pageURL = "http://tlks.io/about";

    casper.start(pageURL);

    casper.then(function() {
        this.test.assert(this.getCurrentUrl() === pageURL, 'url is the one expected');
    });

    casper.then(function() {
        this.test.assertHttpStatus(200, pageURL + ' is up');
    });

    casper.run(function() {
        this.test.done();
    });

});

// http://tlks.io/faq
casper.test.begin('Testing tlks.io : FAQ UI', 2, function(test) {

    var pageURL = "http://tlks.io/faq";

    casper.start(pageURL);

    casper.then(function() {
        this.test.assert(this.getCurrentUrl() === pageURL, 'url is the one expected');
    });

    casper.then(function() {
        this.test.assertHttpStatus(200, pageURL + ' is up');
    });

    casper.run(function() {
        this.test.done();
        this.exit();
    });

});
