var oauth = require('oauth');
var util = require('util');

var config = require('../../config.json');

var _twitterConsumerKey = "P1LBfEJNOHDaTSOQrmAb5Gvil";
var _twitterConsumerSecret = "8B6wkuXDloxrmx1uUZlQEmaSnUzVU3n48XYEcHfzFe33sNu8KK";

var consumer = new oauth.OAuth(
    "https://twitter.com/oauth/request_token",
    "https://twitter.com/oauth/access_token",
    _twitterConsumerKey,
    _twitterConsumerSecret,
    "1.0A",
    config.twitter_callback_url,
    "HMAC-SHA1"
);

exports.index = function (req, res) {
    var context = {};
    res.render('index', context);
};
