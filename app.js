//this is our main server 
var express = require('express');
var Routes = require('./routes/routes');
var partials = require('express-partials');
var errorHandlers = require('./middleware/errorhandlers');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var bodyParser = require('body-parser');
var csrf = require('csurf');
var util = require('./middleware/utilities');
var flash = require('connect-flash');
var config = require('./config');
var log = require('./middleware/log');

var app = express();
app.set('view options', { defaultLayout: 'layout' });
app.set('view engine', 'ejs');
//Trigger  middlewares
app.use(partials());
app.use(log.logger);
app.use(express.static(__dirname + '/static'));
app.use(cookieParser(config.secret));
app.use(session({
    secret: config.secret,
    saveUninitialized: true,
    resave: true,
    store: new RedisStore({ url: config.redisUrl })
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(csrf());
app.use(util.csrf);
app.use(util.authenticated);
app.use(flash());
app.use(util.templateRoutes);



//Get the routes:
app.get('/', Routes.index);
app.get('/login', Routes.login);
app.post('/login', Routes.loginProcess);
app.get('/chat', [util.requireAuthentication], Routes.chat);
app.get('/logout', Routes.logOut);
app.use(errorHandlers.notFound);
app.use(errorHandlers.error);

app.get('/error', function(req, res, next) {
    next(new Error('A contrived error'));
});

app.get('/', function(req, res) {
    res.send('Express Response');
});
app.listen(3000);
console.log("App server running on port 3000");