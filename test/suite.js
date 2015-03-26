var home = require('./tests/home');
var about = require('./tests/about');
var faq = require('./tests/faq');

casper.test.begin('Testing tlks.io : Home', 2, home.testHome);
casper.test.begin('Testing tlks.io : About', 2, about.testAbout);
casper.test.begin('Testing tlks.io : FAQ UI', 2, faq.testFAQ);
