var should = require('should');
var video = require('../../lib/video');

describe('Video', function() {
    'use strict';

    describe('when i receive a youtube video url', function() {

        it('for a url www.youtube.com is a youtube video', function(done) {
            var url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
            var res = video.getCodeAndTypeFromRequest(url);
            should.equal(res[0], "dQw4w9WgXcQ");
            should.equal(res[1], "youtube");
            done();
        });


        it('http://www.youtube.com/watch?v=dQw4w9WgXcQ', function(done) {
            var url = "http://www.youtube.com/watch?v=dQw4w9WgXcQ";
            var res = video.getCodeAndTypeFromRequest(url);
            should.equal(res[0], "dQw4w9WgXcQ");
            should.equal(res[1], "youtube");
            done();
        });

        it('http://youtube.com/watch?v=dQw4w9WgXcQ', function(done) {
            var url = "http://youtube.com/watch?v=dQw4w9WgXcQ";
            var res = video.getCodeAndTypeFromRequest(url);
            should.equal(res[0], "dQw4w9WgXcQ");
            should.equal(res[1], "youtube");
            done();
        });

        it('https://youtube.com/watch?v=dQw4w9WgXcQ', function(done) {
            var url = "https://youtube.com/watch?v=dQw4w9WgXcQ";
            var res = video.getCodeAndTypeFromRequest(url);
            should.equal(res[0], "dQw4w9WgXcQ");
            should.equal(res[1], "youtube");
            done();
        });


        it('https://youtu.be/6DzSAaNQHR8', function(done) {
            var url = "https://youtu.be/6DzSAaNQHR8";
            var res = video.getCodeAndTypeFromRequest(url);
            should.equal(res[0], "6DzSAaNQHR8");
            should.equal(res[1], "youtube");
            done();
        });

    });
});
