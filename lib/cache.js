var fs = require('fs');
var md5 = require('MD5');

function cachefn(res, filePath) {
    'use strict';
    // Serve from caché
    res.setHeader("content-type", "text/html");
    fs.createReadStream(filePath).pipe(res);
}

exports.min5 = (1000 * 60 * 5);
exports.hour1 = (1000 * 60 * 3600);

exports.render = function(req, res, renderfn, miliseconds) {
    'use strict';
    // Check caché
    var fileName = md5(req.url);
    var filePath = __dirname + "/../cache/" + fileName;
    fs.exists(filePath, function(exists) {
        // Get from caché
        if (exists) {
            // Check caché exiration
            fs.stat(filePath, function(err, stats) {
                var now = new Date();
                var diff = now - stats.mtime;
                if (diff < miliseconds) {
                    console.log('Serving from caché', req.url, fileName);
                    // Serve from caché
                    cachefn(res, filePath);
                } else {
                    console.log("Old cache file", req.url, fileName);
                    // Render new file
                    renderfn();
                }
            });
        } else {
            console.log("Not cached", req.url, fileName);
            // Render new file
            renderfn();
        }
    });

};

exports.save = function(url, data) {
    'use strict';
    var fileName = md5(url);
    var filePath = __dirname + "/../cache/" + fileName;
    fs.writeFile(filePath, data, function(err) {
        if (err) {
            console.log(err);
        }
        console.log('Cached', url, fileName);
    });
};

exports.compile = function(url, filePath, context) {
    'use strict';
    var jade = require('jade');
    var tpl = jade.compileFile(filePath);
    var html = tpl(context);
    exports.save(url, html);
    return html;
};
