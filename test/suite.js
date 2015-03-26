var home = require('./tests/home');
var about = require('./tests/about');
var faq = require('./tests/faq');
var privacy = require('./tests/privacy');
var terms = require('./tests/terms');

casper.test.begin('Testing tlks.io : Home', 3, home.testHome),
casper.test.begin('Testing tlks.io : About', 3, about.testAbout),
casper.test.begin('Testing tlks.io : FAQ UI', 3, faq.testFAQ),
casper.test.begin('Testing tlks.io : Privacy', 3, privacy.testPrivacy)
casper.test.begin('Testing tlks.io : Terms', 3, terms.testTerms)

casper.test.begin('Finish suite', 0, function() {
    casper.exit();
});
