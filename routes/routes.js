// this the routes file
var util = require('../middleware/utilities');
exports.index = function index(req, res) {
    res.render('index', { title: 'Index' });
};


function loginProcess(req, res) {
    var isAuth = util.auth(req.body.username, req.body.password, req.session);
    if (isAuth) {
        res.redirect('/chat');
    } else {
        req.flash('error', 'Wrong Username or Password');
        res.redirect('/login');
    }
};

exports.logOut = function logOut(req, res) {
    util.logOut(req.session);
    res.redirect('/');
};



exports.login = function login(req, res) {
    res.render('login', { title: 'Login', message: req.flash('error') });
};

exports.chat = function chat(req, res) {
    res.render('chat', { title: 'Chat' });
};


module.exports.loginProcess = loginProcess;