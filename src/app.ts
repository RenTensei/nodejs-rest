import express, { Express, Request, Response, NextFunction } from 'express';
import logger from 'morgan';
import cors from 'cors';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';

import contactsRouter from './routes/controllers/contacts';
import { HttpError } from './helpers';

const app: Express = express();
const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

// controllers
app.use('/api/contacts', contactsRouter);

// non-existing route
app.use((_, res) => {
  res.status(404).json({ message: 'Route not found!' });
});

// error handler
app.use((err: Error | HttpError | ZodError, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message });
  }
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: 'missing fields',
      details: fromZodError(err).message,
    });
  }
  res.status(500).json({ message: 'Internal Server Error. Try again later!' });
});

export default app;
