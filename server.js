var express    = require("express");
var login = require('./routes/loginroutes1');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var session = require('express-session');
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}));
//var router = express.Router();
// test route
app.use(express.static('Images'));
app.get('/', function(req, res) {
    res.render('homepage');
    console.log('got /');
});

app.set('view engine','pug');
app.set('views','./views');
//route to handle user registration
app.post('/signup',function(req,res){
    res.render('signup');
});
app.post('/signedup',login.signup);
app.post('/login',login.login);
app.post('/added',login.todo);
app.post('/signout',login.signout);
app.post('/addnote',login.addnote);
app.post('/addingnote',login.addingnote);
app.post('/signedout',login.signedout);
//app.post('/login2',login.login2);
//app.use('/api', router);
app.listen(5000);