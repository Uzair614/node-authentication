const dotenv = require('dotenv');
const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

dotenv.config();
mongoose.connect(
	`mongodb://${process.env.dbUser}:${
		process.env.dbPass
	}@ds115553.mlab.com:15553/node-authentication`
);
// mongoose.connect('mongodb://localhost/node-authentication'); //for docker

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log('Connected to database');
	// we're connected!
});
const app = express();
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
	bodyParser.urlencoded({
		extended: true
	})
);

const saltRounds = 10;
let hash;
let myPlaintextPassword;

bcrypt.hash(myPlaintextPassword, saltRounds, function(err, computedHash) {
	// Store hash in your password DB.
	if (!err) {
		hash = computedHash;
	}
});

bcrypt.compare(myPlaintextPassword, hash, function(err, res) {
	// res == true
});

app.post('/signin', (req, res) => {
	const username = req.body.username;
	const pass = req.body.password;
	console.log(`Username: ${username}`);
	console.log(`Password: ${pass}`);
});

app.listen(process.env.port, () => {
	console.log(`Application started on port ${process.env.port}`);
});
