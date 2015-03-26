var home = require('./tests/home');
var about = require('./tests/about');
var faq = require('./tests/faq');
var privacy = require('./tests/privacy');

casper.test.begin('Testing tlks.io : Home', 2, home.testHome),
casper.test.begin('Testing tlks.io : About', 2, about.testAbout),
casper.test.begin('Testing tlks.io : FAQ UI', 2, faq.testFAQ),
casper.test.begin('Testing tlks.io : Privacy', 2, privacy.testPrivacy)

casper.test.begin('Finish suite', 0, function() {
    casper.exit();
});
