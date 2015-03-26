var home = require('./tests/home');
var about = require('./tests/about');
var faq = require('./tests/faq');
var privacy = require('./tests/privacy');
var terms = require('./tests/terms');
var activity = require('./tests/activity');

casper.test.begin('Testing tlks.io : Home', 8, home.testHome);
casper.test.begin('Testing tlks.io : About', 3, about.testAbout);
casper.test.begin('Testing tlks.io : FAQ UI', 3, faq.testFAQ);
casper.test.begin('Testing tlks.io : Privacy', 3, privacy.testPrivacy);
casper.test.begin('Testing tlks.io : Terms', 3, terms.testTerms);
casper.test.begin('Testing tlks.io : Activity', 3, activity.testActivity);

casper.test.begin('Finish suite', 0, function() {
    casper.exit();
});
