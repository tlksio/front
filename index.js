/*jshint unused:false*/
var express = require('express');
var session = require('express-session');
var morgan = require('morgan');
var favicon = require('serve-favicon');
var serveStatic = require('serve-static');
var bodyParser = require('body-parser');
var compress = require('compression');
var vhost = require('vhost');
var csrf = require('csurf');
var fs = require('fs');
var FileStreamRotator = require('file-stream-rotator');

var config = require('./config.json');
var routes = require('./lib/routes');
var legalRoutes = require('./lib/routes/legal.js');
var appRoutes = require('./lib/routes/app.js');
var talkRoutes = require('./lib/routes/talk.js');
var userRoutes = require('./lib/routes/user.js');
var tagRoutes = require('./lib/routes/tag.js');
var rssRoutes = require('./lib/routes/rss.js');

// express.js application
var app = express();

var logDirectory = __dirname + '/log';
// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// create a rotating write stream
var accessLogStream = FileStreamRotator.getStream({
    filename: logDirectory + '/access-%DATE%.log',
    frequency: 'daily',
    verbose: false
});

// setup the logger
app.use(morgan('combined', {stream: accessLogStream}));

// use jade as a template engine
app.set('view engine', 'jade');
app.set('views', __dirname + '/src/views');

// error handler
app.use(function(err, req, res, next) {
    'use strict';
    if (err.code !== 'EBADCSRFTOKEN') {
        return next(err);
    }

    // handle CSRF token errors here
    res.status(403);
    res.send('invalid CSRF token');
});

//  express.js router class
var router = express.Router();

// add a favicon to the app
var faviconPath = __dirname + '/public/img/favicon.png';
router.use(favicon(faviconPath));

// serve public assets from './public'
// caching by default for one day
var oneDay = 86400000;
router.use(serveStatic(__dirname + '/public', {
    maxAge: oneDay
}));

// parse body payloads
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));

// this express.js app use sessions
router.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));


// use CSRF protection middleware
router.use(csrf());

// use gzip compression
router.use(compress());

// routes
router.get('/', routes.index);
router.get('/activity', routes.activity);

router.get('/privacy', legalRoutes.privacy);
router.get('/terms', legalRoutes.terms);

router.get('/about', appRoutes.about);
router.get('/faq', appRoutes.faq);
router.get('/contactus', appRoutes.contactus);

router.get('/auth/login', routes.login);
router.get('/auth/logout', routes.authLogout);
router.get('/auth/twitter', routes.authTwitter);
router.get('/auth/twitter/callback', routes.authTwitterCallback);

router.get('/popular', talkRoutes.popular);
router.get('/popular/page/:page', talkRoutes.popular);
router.get('/latest', talkRoutes.latest);
router.get('/latest/page/:page', talkRoutes.latest);

router.get('/profile/:username', userRoutes.profile);
router.get('/profile/:username/published', userRoutes.profile);
router.get('/profile/:username/published/page/:page', userRoutes.profile);
router.get('/profile/:username/upvoted', userRoutes.profileUpvoted);
router.get('/profile/:username/upvoted/page/:page', userRoutes.profileUpvoted);
router.get('/profile/:username/favorited', userRoutes.profileFavorited);
router.get('/profile/:username/favorited/page/:page',
    userRoutes.profileFavorited);
router.route('/profile/:username/settings')
    .get(userRoutes.settings)
    .post(userRoutes.settingsSave);

router.route('/talk/add')
    .get(talkRoutes.add)
    .post(talkRoutes.save);

router.get('/talk/play/:slug', talkRoutes.play);
router.get('/talk/favorite/:id', talkRoutes.favorite);
router.get('/talk/unfavorite/:id', talkRoutes.unfavorite);
router.get('/talk/upvote/:id', talkRoutes.upvote);
router.get('/talk/:slug', talkRoutes.talk);

router.get('/tag/:tag', tagRoutes.tag);
router.get('/tag/:tag/page/:page', tagRoutes.tag);

router.get('/rss/latest', rssRoutes.latest);
router.get('/rss/popular', rssRoutes.popular);
router.get('/rss/tag/:tag', rssRoutes.tag);

router.get('/search', talkRoutes.search);

// Default route
router.get('*', function(req, res, next) {
    'use strict';

    var err = new Error();
    err.status = 404;
    next(err);
});

// production error handler : no stacktraces leaked to user
router.use(function(err, req, res, next) {
    'use strict';

    res.status(err.status || 500);
    var context = {
        message: err.message,
        error: err
    };
    res.render(err.status, context);
});

// which virtual hosts are we gonna use?
app.use(vhost(config.vhost, router));

// start the HTTP server
var server = app.listen(config.port, function() {
    "use strict";
    var host = server.address().address;
    var port = server.address().port;
    console.log('tlks.io front listening at http://%s:%s', host, port);
});
