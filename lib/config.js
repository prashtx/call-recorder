'use strict';

var config = module.exports;

config.port = process.env.PORT;

config.AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
config.AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

// When we send a voicemail notification, who should we use as the sender?
// This must be a verified sender in Amazon SES
config.emailSource = process.env.EMAIL_SOURCE;

// Where we send the recording URL
config.emailDestination = process.env.EMAIL_DEST;

