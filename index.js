/*jshint unused:false*/
var express = require('express');
var session = require('express-session');
var logger = require('express-logger');
var favicon = require('serve-favicon');
var serveStatic = require('serve-static');
var bodyParser = require('body-parser');
var compress = require('compression');

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

// using a simple logger
app.use(logger({
    path: "./log/app.log"
}));

// add a favicon to the app
var faviconPath = __dirname + '/public/img/favicon.png';
app.use(favicon(faviconPath));

// serve public assets from './public'
// caching by default for one day
var oneDay = 86400000;
app.use(serveStatic(__dirname + '/public', {
    maxAge: oneDay
}));

// use jade as a template engine
app.set('view engine', 'jade');
app.set('views', __dirname + '/src/views');

// parse body payloads
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// this express.js app use sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

// use gzip compression
app.use(compress());

// routes
app.get('/', routes.index);
app.get('/activity', routes.activity);

app.get('/privacy', legalRoutes.privacy);
app.get('/terms', legalRoutes.terms);

app.get('/about', appRoutes.about);
app.get('/faq', appRoutes.faq);

app.get('/auth/login', routes.login);
app.get('/auth/logout', routes.authLogout);
app.get('/auth/twitter', routes.authTwitter);
app.get('/auth/twitter/callback', routes.authTwitterCallback);

app.get('/popular', talkRoutes.popular);
app.get('/popular/:page', talkRoutes.popular);
app.get('/latest', talkRoutes.latest);
app.get('/latest/:page', talkRoutes.latest);

app.get('/profile/:username', userRoutes.profile);
app.get('/profile/:username/:page', userRoutes.profile);
app.get('/profile/:username/upvoted', userRoutes.profileUpvoted);
app.get('/profile/:username/favorited', userRoutes.profileFavorited);
app.route('/profile/:username/settings')
    .get(userRoutes.settings)
    .post(userRoutes.settingsSave);

app.route('/talk/add')
    .get(talkRoutes.add)
    .post(talkRoutes.save);
app.get('/talk/play/:slug', talkRoutes.play);
app.get('/talk/favorite/:id', talkRoutes.favorite);
app.get('/talk/unfavorite/:id', talkRoutes.unfavorite);
app.get('/talk/upvote/:id', talkRoutes.upvote);
app.get('/talk/:slug', talkRoutes.talk);

app.get('/tag/:tag', tagRoutes.tag);
app.get('/tag/:tag/:page', tagRoutes.tag);

app.get('/rss/latest', rssRoutes.latest);
app.get('/rss/popular', rssRoutes.popular);
app.get('/rss/tag/:tag', rssRoutes.tag);

app.get('/search', talkRoutes.search);

// Default route
app.get('*', function(req, res, next) {
    'use strict';

    var err = new Error();
    err.status = 404;
    next(err);
});

// production error handler : no stacktraces leaked to user
app.use(function(err, req, res, next) {
    'use strict';

    res.status(err.status || 500);
    var context = {
        message: err.message,
        error: err
    };
    res.render(err.status, context);
});

// start the HTTP server
var server = app.listen(config.port, function() {
    "use strict";
    var host = server.address().address;
    var port = server.address().port;
    console.log('tlks.io front listening at http://%s:%s', host, port);
});
