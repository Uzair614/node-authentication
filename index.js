const express = require('express');
const app = express();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/MONGO');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log('connected');
	// we're connected!
});

const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 'passwordPlain';

bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
	// Store hash in your password DB.
});

bcrypt.compare(myPlaintextPassword, hash, function(err, res) {
	// res == true
});
