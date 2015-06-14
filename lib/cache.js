var fs = require('fs');
var jade = require('jade');
var md5 = require('MD5');

function save(url, data) {
    'use strict';
    var fileName = md5(url);
    var filePath = "/tmp/" + fileName;
    fs.writeFile(filePath, data, function(err) {
        if (err) {
            console.log(err);
        }
        console.log('Cached to disk', url, fileName);
    });
};

exports.compile = function(url, filePath, context) {
    'use strict';
    var tpl = jade.compileFile(filePath);
    var html = tpl(context);
    save(url, html);
    return html;
};
