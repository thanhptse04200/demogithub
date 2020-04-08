var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// getting-started.js
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/MyDatabase', { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('DB connected');
});
var accountSchema = new mongoose.Schema({
  username: String,
  password: String
}, { collection: 'account' });
var AccountModel = mongoose.model('account', accountSchema)
var acc1 = new AccountModel({username: 'Mai',password: '123456'});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/home', (req, res, next) => {
  res.render('home', {
    name: 'Thanh',
    age: 25,
    address: ['Ha Noi', 'Hai Duong', 'Nam Dinh']
  })
})

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/account',(req,res)=>{
  AccountModel.find({}).exec().then(function(data){
    console.log(data);
    res.json(data);
  })
  
})


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
