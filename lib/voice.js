/*jslint node: true nomen: true*/
'use strict';

var twilio = require('twilio');
var tz = require('timezone')(require('timezone/America'));

var config = require('./config');
var email = require('./email');

var destination = config.emailDestination;

exports.inbound = function inbound(req, res) {
  var resp = new twilio.TwimlResponse();

  resp
  .say('Starting the call recording', {
    voice: 'alice',
    language: 'en-us'
  })
  .record({
    method: 'POST',
    maxLength: 7200
  });
  res.set('Content-Type', 'text/xml');
  res.send(resp.toString());
};

exports.voicemailDone = function voicemail(req, res) {
  email.recording({
    destination: destination,
    url: req.body.RecordingUrl,
    duration: req.body.RecordingDuration
  }, function (error) {
    if (error) {
      console.error('Error sending email for voicemail recording');
      console.error(error.name);
      console.error(error.message);
      console.log(error);
    }

    var resp = new twilio.TwimlResponse();
    resp.hangup();

    res.set('Content-Type', 'text/xml');
    res.send(resp.toString());
  });
};
