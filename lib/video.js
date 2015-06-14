var url = require('url');

/*
 * Get video code and type from an URL.
 *
 * Example:
 * https://www.youtube.com/watch?v=dQw4w9WgXcQ -> ["dQw4w9WgXcQ", "youtube"]
 *
 * @param string string URL to parse.
 * @return array [code, type] extracted from url.
 */
exports.getCodeAndTypeFromRequest = function(uri) {
    'use strict';
    var type;
    var code;
    var domain = url.parse(uri).hostname || '';
    var path = url.parse(uri).path || '';

    switch (domain) {
        case 'www.youtube.com':
        case 'youtube.com':
        case 'youtu.be':
            type = "youtube";
            code = path.match(/^\/(watch\?v=)?(([^/])+)($|\/)/i)[2] || '';
            break;
        case 'vimeo.com':
            type = "vimeo";
            code = path.match(/^\/(\d+)(\/|$)/)[1] || '';
            break;
        default:
            throw new Error("Invalid URL");
    }

    if (code === "") {
        throw new Error("Invalid URL");
    }

    return [code, type];
};
