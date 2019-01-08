const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();
const winston = require('winston');
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Cors = require('cors');
const { findUserExists, insertUserInDb } = require('./database');

const app = express();
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(Cors());
const saltRounds = 10;

function validateUsernamePasswordRequirements(username, password) {
  const schema = {
    username: Joi.string().required(),
    password: Joi.string()
      .min(8)
      .required()
  };
  const { error } = Joi.validate({ username, password }, schema, {
    abortEarly: false
  });
  if (error) {
    logger.log(error);
    return error.details
      .map(e => e.message)
      .reduce((final, cur) => (final += cur + '\n'));
  } else {
    return null;
  }
}

app.post('/signin', async (req, res) => {
  const { username, password } = req.body;
  try {
    const dbResponse = await findUserExists(username);
    if (dbResponse) {
      const match = await bcrypt.compare(password, dbResponse.password);
      if (match) {
        const token = jwt.sign(
          { _id: dbResponse._id },
          process.env.jwtPrivateKey
        );
        res.cookie('SessionID', token, { httpOnly: true, secure: true });
        return res.status(200).send({ message: 'Signed In' });
      }
    } else {
      return res.status(422).send({ message: 'Invalid Username or Password' });
    }
  } catch (error) {
    logger.error(error);
    return res.status(500).send({ message: 'Could not process request.' });
  }
});

app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const error = validateUsernamePasswordRequirements(username, password);
  if (error) {
    logger.error(error);
    return res.status(422).send({ message: error });
  } else {
    const userExists = await findUserExists(username);
    if (!userExists) {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      try {
        const insertResponse = await insertUserInDb(username, hashedPassword);
        const token = jwt.sign(
          { _id: insertResponse._id },
          process.env.jwtPrivateKey
        );
        res.cookie('SessionID', token, { httpOnly: true, secure: true });
        return res.status(201).send(`Successfully added ${username}`);
      } catch (error) {
        // insertion failed
        logger.error(error);
        return res.status(500).send({ message: 'Could not process request.' });
      }
    } else {
      return res.status(422).send({ message: 'Username already exists' });
    }
  }
});

app.get('/profile', function(req, res) {
  const cookie = req.cookies;
  console.log(cookie);
  res.send({ cookie });
});

app.listen(process.env.port, () => {
  console.log(`Application started on port ${process.env.port}`);
});
