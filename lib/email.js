'use strict';

var fs = require('fs');

var ejs = require('ejs');
var request = require('request');

var SHA = require('./sha256');
var config = require('./config');

var templates = {
  voicemail: function (done) {
    var template = fs.readFileSync('lib/templates/email-voicemail.ejs').toString();
    templates.voicemail = function (done) {
      done(null, template);
    };
    done(null, template);
  }
};

exports.recording = function voicemail(data, done) {
  templates.voicemail(function (error, template) {
    if (error) {
      done(error);
      return;
    }

    var date = (new Date()).toUTCString();
    var shaObj = new SHA(date, 'TEXT');
    var hmac = shaObj.getHMAC(config.AWS_SECRET_ACCESS_KEY, 'TEXT', 'SHA-256', 'B64');
    request({
      method: 'POST',
      url: 'https://email.us-east-1.amazonaws.com/',
      form: {
        Action: 'SendEmail',
        Source: config.emailSource,
        'Destination.ToAddresses.member.1': data.destination,
        'Message.Subject.Data': 'New Voicemail',
        'Message.Body.Text.Data': ejs.render(template, data)
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Date': date,
        'X-Amzn-Authorization': 'AWS3-HTTPS AWSAccessKeyId=' + config.AWS_ACCESS_KEY_ID + ',Algorithm=HMACSHA256,Signature=' + hmac
      }
    }, function (error, resp, body) {
      if (error) {
        console.log('Got status ' + resp.status + ' from SES.');
        console.log(resp.body);
        done(error);
        return;
      }
      console.log('Got status ' + resp.status + ' from SES.');
      console.log(resp.body);
      done(null);
    });
  });
};
