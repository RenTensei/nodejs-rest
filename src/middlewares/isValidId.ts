import { isValidObjectId } from 'mongoose';
import type { NextFunction, Request, Response } from 'express';
import { HttpError } from '../helpers';

export const isValidId = (
  req: Request<{ contactId: string }>,
  res: Response,
  next: NextFunction
) => {
  const contactId = req.params.contactId;
  isValidObjectId(contactId) ? next() : next(new HttpError(400, `${contactId} is not a valid id!`));
};
