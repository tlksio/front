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

app.get('/privacy', legalRoutes.privacy);
app.get('/terms', legalRoutes.terms);

app.get('/about', appRoutes.about);
app.get('/faq', appRoutes.faq);

app.get('/login', routes.login);
app.get('/logout', routes.authLogout);
app.get('/auth/twitter', routes.authTwitter);
app.get('/auth/twitter/callback', routes.authTwitterCallback);

app.get('/add', routes.add);
app.post('/add', routes.save);
app.get('/profile', routes.profile);
app.get('/settings', routes.settings);

app.get('/talk/play/:id', talkRoutes.play);
app.get('/talk/:slug', talkRoutes.talk);

app.get('/tag/:tag', routes.tag);

app.get('/profile/:username', routes.publicProfile);

var server = app.listen(config.port, function () {
    "use strict";
    var host = server.address().address;
    var port = server.address().port;
    console.log('techtalks.io front listening at http://%s:%s', host, port);
});
