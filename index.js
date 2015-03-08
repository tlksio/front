var express = require('express');
var session = require('express-session');
var logger = require('express-logger');
var favicon = require('serve-favicon');
var serveStatic = require('serve-static');
var bodyParser = require('body-parser');

var config = require('./config.json');
var routes = require('./lib/routes');
var legalRoutes = require('./lib/routes/legal.js');
var appRoutes = require('./lib/routes/app.js');
var talkRoutes = require('./lib/routes/talk.js');
var userRoutes = require('./lib/routes/user.js');
var tagRoutes = require('./lib/routes/tag.js');
var rssRoutes = require('./lib/routes/rss.js');

var app = express();

app.use(logger({path: "./log/app.log"}));
app.use(favicon(__dirname + '/public/img/favicon.png'));
app.use(serveStatic(__dirname + '/public'));

app.set('view engine', 'jade');
app.set('views', __dirname + '/src/views');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

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

app.get('/profile/:username', userRoutes.profile);
app.get('/profile/:username/settings', userRoutes.settings);
app.post('/profile/:username/settings', userRoutes.settingsSave);

app.get('/talk/add', talkRoutes.add);
app.post('/talk/add', talkRoutes.save);
app.get('/talk/play/:id', talkRoutes.play);
app.get('/talk/favorite/:id', talkRoutes.favorite);
app.get('/talk/unfavorite/:id', talkRoutes.unfavorite);
app.get('/talk/:slug', talkRoutes.talk);

app.get('/tag/:tag', tagRoutes.tag);

app.get('/rss/latest', rssRoutes.latest);
app.get('/rss/popular', rssRoutes.popular);
app.get('/rss/tag/:tag', rssRoutes.tag);

app.get('/search', talkRoutes.search);

var server = app.listen(config.port, function () {
    "use strict";
    var host = server.address().address;
    var port = server.address().port;
    console.log('tlks.io front listening at http://%s:%s', host, port);
});
