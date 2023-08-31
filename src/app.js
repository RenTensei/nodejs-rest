const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const { ZodError } = require('zod');
const { fromZodError } = require('zod-validation-error');

const authRoutes = require('./routes/auth');
const contactsRoutes = require('./routes/contacts');
const { HttpError } = require('./helpers');
const { JsonWebTokenError } = require('jsonwebtoken');

const app = express();
const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

// apply routes
app.use('/api/contacts', contactsRoutes);
app.use('/api/users', authRoutes);

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
  if (err instanceof JsonWebTokenError) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  console.log(err.message);

  res.status(500).json({ message: 'Internal Server Error. Try again later!' });
});

module.exports = app;
