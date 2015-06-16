var should = require('should');
var video = require('../../lib/video');

describe('Video', function() {
    'use strict';

    describe('https://www.youtube.com/watch?v=dQw4w9WgXcQ', function() {

        it('for a url www.youtube.com is a youtube video', function(done) {
            var url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
            var res = video.getCodeAndTypeFromRequest(url);
            should.equal(res[0], "dQw4w9WgXcQ");
            should.equal(res[1], "youtube");
            done();
        });


        it('http://www.youtube.com/watch?v=dQw4w9WgXcQ', function(done) {
            var url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
            var res = video.getCodeAndTypeFromRequest(url);
            should.equal(res[0], "dQw4w9WgXcQ");
            should.equal(res[1], "youtube");
            done();
        });

        it('http://youtube.com/watch?v=dQw4w9WgXcQ', function(done) {
            var url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
            var res = video.getCodeAndTypeFromRequest(url);
            should.equal(res[0], "dQw4w9WgXcQ");
            should.equal(res[1], "youtube");
            done();
        });

        it('https://youtube.com/watch?v=dQw4w9WgXcQ', function(done) {
            var url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
            var res = video.getCodeAndTypeFromRequest(url);
            should.equal(res[0], "dQw4w9WgXcQ");
            should.equal(res[1], "youtube");
            done();
        });



    });
});
