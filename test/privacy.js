var page = require('webpage').create();
var base_url = "http://tlks.io";
var url;

url = "/privacy";
page.open(base_url + url, function(status) {
    console.log(base_url + url + "/privacy status: " + status);
    phantom.exit();
});
