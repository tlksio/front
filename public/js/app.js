// IIFE
(function(tlksio) {
    'use strict';
    tlksio(window.jQuery, window, document);
}(function($, window, document) {
    'use strict';
    // $ locally scoped
    $(function() {
        // DOM ready
        $('.js-vote-anon').click(function() {
            console.log('overlay');
        });
        $('.js-vote').click(function() {
            var url = '/talk/upvote/' + $(this).data('id');
            $.ajax({
                type: 'GET',
                url: url,
                context: this,
                success: function(req) {
                    if (req.result === true) {
                        var counter = $(this).find('.counter');
                        var numVotes = parseInt(counter.text());
                        counter.text(numVotes + 1);
                        $(this).attr('disabled', 'disabled');
                    }
                },
            });
        });
        $('.favorite, .unfavorite').click(function() {
            var cmd = $(this).hasClass('favorite') ? 'favorite' : 'unfavorite';
            var url = '/talk/' + cmd + '/' + $(this).data('id');
            $.ajax({
                type: 'GET',
                url: url,
                context: this,
                success: function(req) {
                    if (req.result === true) {
                        $(this).toggleClass('favorite')
                            .toggleClass('unfavorite');
                    }
                },
            });
        });
    });
    // DOM not ready
}));
