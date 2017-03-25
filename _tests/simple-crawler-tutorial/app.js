var express = require('express');
var path = require('path');

var routes = require('./routes/index');

var app = express();

app.use('/', routes);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


module.exports = app;