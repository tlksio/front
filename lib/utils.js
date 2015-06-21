/*
 * Returns an array with unique values removing duplicated elements from
 * it
 *
 * Example:
 * ['a', 'b', 'a', 'c'] => ['a', 'b', 'c']
 *
 * @param array a list of elements.
 * @return array unique list of elements.
 */
exports.uniq = function(a) {
    'use strict';

    var seen = {};
    return a.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
};

/*
 * Converts breaklines to <br> tags from an string
 *
 * Example:
 * "foo\nbar" => "foo<br>bar"
 *
 * @param string str string with breaklines.
 * @return string string without breaklines.
 */
exports.nl2br = function(str) {
    'use strict';

    var breakTag = '<br>';
    var subs = '$1' + breakTag + '$2';
    return str.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, subs);
};
