/*jslint node: true */
'use strict';

var voice = require('./voice');

function enforceHTTPS(req, res, next) {
  if (!req.secure) {
    res.send(400);
    return;
  }
  next();
}

exports.setup = function setup(app) {
  // Twilio
  app.get('/api/twilio/voice/inbound', enforceHTTPS, voice.inbound);
  app.post('/api/twilio/voice/recording', voice.recordingDone);

};

