import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app';

dotenv.config();

mongoose
  .connect(process.env.MONGO_CONNECTION_STRING || '')
  .then(() => {
    app.listen(3000, () => {
      console.log('Server running. Use our API on port: 3000');
    });
  })
  .catch(err => {
    console.log(err);
    process.exit(1);
  });
