var home = require('./tests/home');
var about = require('./tests/about');
var faq = require('./tests/faq');
var privacy = require('./tests/privacy');
var terms = require('./tests/terms');
var activity = require('./tests/activity');
var login = require('./tests/login');
var talk = require('./tests/talk');
var popular = require('./tests/popular');

casper.test.begin('Testing tlks.io : Home', 8, home.testHome);
casper.test.begin('Testing tlks.io : About', 3, about.testAbout);
casper.test.begin('Testing tlks.io : FAQ', 3, faq.testFAQ);
casper.test.begin('Testing tlks.io : Privacy', 3, privacy.testPrivacy);
casper.test.begin('Testing tlks.io : Terms', 3, terms.testTerms);
casper.test.begin('Testing tlks.io : Activity', 3, activity.testActivity);
casper.test.begin('Testing tlks.io : Login', 3, login.testLogin);
casper.test.begin('Testing tlks.io : Talk detailed view', 3, talk.testTalk);
casper.test.begin('Testing tlks.io : Popular talks', 3, popular.testPopular);

casper.test.begin('Finish suite', 0, function() {
    casper.exit();
});
