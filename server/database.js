const mongoose = require('mongoose');
mongoose.connect(
  `mongodb://${process.env.dbUser}:${
    process.env.dbPass
  }@ds115553.mlab.com:15553/node-authentication`,
  { useNewUrlParser: true }
);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to database');
});

const dbCollection = db.collection('users');

function findUserExists(username) {
  return dbCollection.findOne({ username });
}

async function insertUserInDb(username, password) {
  const res = await dbCollection.insertOne({ username, password });
  if (!res.result.ok) {
    const err = new Error('Insertion Error');
    return Promise.reject(err);
  } else {
    return { _id: res.insertedId, username: username };
  }
}

module.exports = { findUserExists, insertUserInDb };
