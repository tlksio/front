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
        .then(function() {
            test.assertExists('.search-form', "Search section exists");
        })
        .then(function() {
            test.assertExists('.latest-talks', "Latest talks section exists");
        })
        .then(function() {
            test.assertEval(function() {
                var selector = ".latest-talks .talk";
                return __utils__.findAll(selector).length === 5;
            }, "There are 5 latest talks listed");
        })
        .then(function() {
            test.assertExists('.popular-talks', "Popular talks section exists");
        })
        .then(function() {
            test.assertEval(function() {
                var selector = ".popular-talks .talk";
                return __utils__.findAll(selector).length === 5;
            }, "There are 5 popular talks listed");
        })
        .run(function() {
            test.done();
        });
};
