import { Request, Response, Router } from 'express';

import {
  addContact,
  getContactById,
  listContacts,
  removeContact,
  updateContact,
} from '../../models/contacts.ts';
import { UpdateContactDataSchema, type IContactData } from '../../models/contact.schema.ts';
import handlerWrapper from '../../helpers/reqHandlerWrapper.ts';

const router = Router();

router.get(
  '/',
  handlerWrapper(async (_, res: Response<IContactData[]>) => {
    const contacts = await listContacts();
    res.json(contacts);
  })
);

router.get(
  '/:contactId',
  handlerWrapper<{ contactId: string }>(async (req, res: Response<IContactData>) => {
    const contactId = req.params.contactId;
    const contact = await getContactById(contactId);
    res.json(contact);
  })
);

router.post(
  '/',
  handlerWrapper(async (req: Request, res: Response<IContactData>) => {
    const validatedBody = UpdateContactDataSchema.parse(req.body);
    const addedContact = await addContact(validatedBody);
    res.status(201).json(addedContact);
  })
);

router.delete(
  '/:contactId',
  handlerWrapper<{ contactId: string }>(async (req, res: Response<{ message: string }>) => {
    const contactId = req.params.contactId;
    const removedContact = await removeContact(contactId);
    res.json({ message: 'contact deleted' });
  })
);

router.put(
  '/:contactId',
  handlerWrapper<{ contactId: string }>(async (req, res: Response<IContactData>) => {
    const contactId = req.params.contactId;
    const validatedBody = UpdateContactDataSchema.parse(req.body);
    const updatedContact = await updateContact(contactId, validatedBody);
    res.json(updatedContact);
  })
);

export default router;
