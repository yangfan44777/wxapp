/*wxapp*/
//var express = require('express');
import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import 'regenerator-runtime/runtime';
import config from './config.js';
import graphqlHTTP from 'express-graphql';
import commonditySchema from './graphqlSchemas/commonditySchema.js';
import userSchema from './graphqlSchemas/userSchema.js';
import mongoose from 'mongoose';

import payorder from './routes/payorder.js';
import paycb from './routes/paycb.js';
import phonecode from './routes/phonecode.js';
import authentication from './routes/authentication.js';
import login from './routes/login.js';

/* 数据库连接 */
mongoose.connect('mongodb://'+config.db.host+'/' + config.db.name);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/login', login);

/* 登录验证 */
app.use('/', authentication);

app.use('/commondity', graphqlHTTP({
  schema: commonditySchema,
  pretty: true
}));

app.use('/user', graphqlHTTP({
  schema: userSchema,
  pretty: true
}));

app.use('/payorder', payorder);
app.use('/paycb', paycb);
app.use('/phonecode', phonecode);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
