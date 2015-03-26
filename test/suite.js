var siteName = "tlks.io";

// http://tlks.io/
casper.test.begin('Testing tlks.io UI', 2, function(test) {

    var url = "http://tlks.io/";

    casper.start(url);

    casper.then(function() {
        this.test.assert(this.getCurrentUrl() === url, 'url is the one expected');
    });

    casper.then(function() {
        this.test.assertHttpStatus(200, siteName + ' is up');
    });

    casper.run(function() {
        this.test.done();
    });

});

// http://tlks.io/about
casper.test.begin('Testing tlks.io : About UI', 2, function(test) {

    var url = "http://tlks.io/about";

    casper.start(url);

    casper.then(function() {
        this.test.assert(this.getCurrentUrl() === url, 'url is the one expected');
    });

    casper.then(function() {
        this.test.assertHttpStatus(200, siteName + ' is up');
    });

    casper.run(function() {
        this.test.done();
        this.exit();
    });

});
