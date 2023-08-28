const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const { ZodError } = require('zod');
const { fromZodError } = require('zod-validation-error');

const contactsController = require('./routes/controllers/contacts');
const { HttpError } = require('./helpers');

const app = express();
const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

// controllers
app.use('/api/contacts', contactsController);

// non-existing route
app.use((_, res) => {
  res.status(404).json({ message: 'Route not found!' });
});

// error handler
app.use((err, req, res, next) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message });
  }
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: 'missing fields',
      details: fromZodError(err).message,
    });
  }

  console.log(err.message);
  res.status(500).json({ message: 'Internal Server Error. Try again later!' });
});

module.exports = app;
