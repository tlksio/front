var page = require('webpage').create();
var base_url = "http://tlks.io";
var url;

url = "";
page.open(base_url + url, function(status) {
    console.log(base_url + url + " status: " + status);
    phantom.exit();
});
