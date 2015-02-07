var express = require('express');
var session = require('express-session');
var logger = require('express-logger');
var favicon = require('serve-favicon');
var serveStatic = require('serve-static');
var bodyParser = require('body-parser');

var config = require('./config.json');
var routes = require('./lib/routes');

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

app.get('/privacy', routes.privacy);
app.get('/terms', routes.terms);
app.get('/about', routes.about);
app.get('/faq', routes.faq);

app.get('/login', routes.login);
app.get('/logout', routes.authLogout);
app.get('/auth/twitter', routes.authTwitter);
app.get('/auth/twitter/callback', routes.authTwitterCallback);

app.get('/add', routes.add);
app.post('/add', routes.save);
app.get('/profile', routes.profile);
app.get('/settings', routes.settings);

app.get('/talk/play/:id', routes.play);
app.get('/talk/:slug', routes.talk);

app.get('/tag/:tag', routes.tag);

app.get('/profile/:username', routes.publicProfile);

var server = app.listen(config.port, function () {
    "use strict";
    var host = server.address().address;
    var port = server.address().port;
    console.log('techtalks.io front listening at http://%s:%s', host, port);
});
