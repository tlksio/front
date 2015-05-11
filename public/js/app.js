// IIFE
(function(tlksio) {
    'use strict';
    tlksio(window.jQuery, window, document);
}(function($, window, document) {
    'use strict';
    // $ locally scoped
    $(function() {
        // DOM ready
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
            ga('send', 'event', 'button', 'vote', 'upvote');
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
                        var count = parseInt($(this).data('count'), 10);
                        count += (cmd === 'favorite') ? +1 : -1;
                        $(this).toggleClass('favorite')
                            .toggleClass('unfavorite')
                            .data('count', count)
                            .find('span')
                            .html(count + ' Favorites');
                    }
                },
            });
            ga('send', 'event', 'button', 'favorite', cmd);
        });
        $('.js-vote-anon').click(function() {
            ga('send', 'event', 'button', 'vote', 'vote-anon');
        });
    });
    // DOM not ready
}));
