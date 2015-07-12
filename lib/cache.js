var fs = require('fs');
var jade = require('jade');
var md5 = require('MD5');

exports.save = function(url, data) {
    'use strict';
    var fileName = md5(url);
    var filePath = "/opt/tlks.io/.cache/" + fileName;
    fs.writeFile(filePath, data, function(err) {
        if (err) {
            return err;
        }
        console.log('Cached to disk', url, fileName);
    });
};

exports.compile = function(url, filePath, context) {
    'use strict';
    var tpl = jade.compileFile(filePath);
    var html = tpl(context);
    return html;
};
