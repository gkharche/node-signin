const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

const app = express();
const port = 8000;


// mongodb connect
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/signin',{
  useMongoClient:true
}).then(function(){
  console.log('MongoDB Connected');
})
.catch(function(err){
  if(err) throw err;
});

//handlebars middleware
app.use(express.static(path.join(__dirname, 'public')));
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
}));
app.set('view engine', 'handlebars');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json());



app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
//2. Passport middleware
app.use(passport.initialize());
app.use(passport.session());
//require('./config/passport')(passport);


app.use(flash());
//set local variable only for view
//set gloabl varialbes for flash message
app.use(function (req, res, next) {
  // NOTE: res.locals
  //An object that contains response local variables scoped to the request, and
  //therefore available only to the view(s) rendered during that request / response cycle (if any). Otherwise, this property is identical to app.locals.
  //This property is useful for exposing request-level information such as the request path name, authenticated user, user settings, and so on.
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});


//Routes
const users = require('./routes/users');
app.use('/users', users);

//Passport config
//pass passport package to passport config (passport)
require('./config/passport')(passport);








app.listen(port, function () {
  console.log('Server Starting And Bind With Port ' + port);
});
