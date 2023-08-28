import { Request, Response, Router } from 'express';

import { UpdateContactDataSchema, type IContactData } from '../../models/contact.schema.ts';
import handlerWrapper from '../../helpers/reqHandlerWrapper.ts';
import { Contact } from '../../models/Contact.ts';
import HttpError from '../../helpers/HttpError.ts';
import { isValidId } from '../../middlewares/isValidId.ts';

const router = Router();

router.get(
  '/',
  handlerWrapper(async (_, res: Response<IContactData[]>) => {
    const contacts = await Contact.find();
    res.json(contacts);
  })
);

router.get(
  '/:contactId',
  isValidId,
  handlerWrapper<{ contactId: string }>(async (req, res: Response<IContactData>) => {
    const contactId = req.params.contactId;
    const contact = await Contact.findById(contactId);
    if (!contact) throw new HttpError(404, 'Not found');
    res.json(contact);
  })
);

router.post(
  '/',
  handlerWrapper(async (req: Request, res: Response<IContactData>) => {
    const validatedBody = UpdateContactDataSchema.parse(req.body);
    const addedContact = await Contact.create(validatedBody);
    res.status(201).json(addedContact);
  })
);

router.put(
  '/:contactId',
  isValidId,
  handlerWrapper<{ contactId: string }>(async (req, res: Response<IContactData>) => {
    const contactId = req.params.contactId;
    const validatedBody = UpdateContactDataSchema.parse(req.body);
    const updatedContact = await Contact.findByIdAndUpdate(contactId, validatedBody);
    if (!updatedContact) throw new HttpError(404, 'Not found');
    res.json(updatedContact);
  })
);

router.delete(
  '/:contactId',
  isValidId,
  handlerWrapper<{ contactId: string }>(async (req, res: Response<{ message: string }>) => {
    const contactId = req.params.contactId;
    const removedContact = await Contact.findByIdAndDelete(contactId);
    if (!removedContact) throw new HttpError(404, 'Not found');
    res.json({ message: 'contact deleted' });
  })
);

export default router;
