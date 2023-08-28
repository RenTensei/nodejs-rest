const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app.js');

dotenv.config();

mongoose
  .connect(process.env.MONGO_CONNECTION_STRING || '')
  .then(() => {
    app.listen(3000, () => {
      console.log('Database connection successful');
      console.log('Server running. Use our API on port: 3000');
    });
  })
  .catch(err => {
    console.log(err);
    process.exit(1);
  });
