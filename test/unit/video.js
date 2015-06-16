var should = require('should');
var video = require('../../lib/video');

describe('Video', function() {
    'use strict';

    describe('get the type and the code from a video url', function() {

        it('for a url www.youtube.com is a youtube video', function(done) {

            var url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
            var res = video.getCodeAndTypeFromRequest(url);
            should.equal(res.code, "dQw4w9WgXcQ");
            should.equal(res.type, "youtube");
            should.notEqual(1, 2);
            done();
        });

    });
});
