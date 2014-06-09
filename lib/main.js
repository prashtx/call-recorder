'use strict';

var http = require('http');

var express = require('express');

var config = require('./config');
var routes = require('./routes');

var app = express();

app.use(express.logger());

app.enable('trust proxy');

app.use(express.bodyParser());

// Add common headers
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Mime-Type, X-Requested-With, X-File-Name, Content-Type');
  next();
});

routes.setup(app);

var server = http.createServer(app);
server.listen(config.port, function (error) {
  if (error) { throw error; }
  console.log('Listening on port ' + config.port);
});

