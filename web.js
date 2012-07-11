var async   = require('async');
var express = require('express');
var util    = require('util');

// create an express webserver
var app = express.createServer(
  express.logger(),
  express.static(__dirname + '/public'),
  express.bodyParser(),
  express.cookieParser(),
  // set this to a secret value to encrypt session cookies
  express.session({ secret: process.env.SESSION_SECRET || 'secret123' })
);
var io = require('socket.io').listen(app);

// listen to the PORT given to us in the environment
var port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log("Listening on " + port);
});

io.sockets.on('connection', function (socket) {
  socket.on('flip', function (data) {
    console.log("flip", data);
  });
  socket.on('match', function (data) {
    console.log("match", data);
  });
});
