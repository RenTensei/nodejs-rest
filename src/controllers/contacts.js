import { Contact } from '../models/Contact/Contact';
import { HttpError, handlerWrapper } from '../helpers';
import { UpdateContactDataSchema, UpdateFavoriteSchema } from '../models/Contact/contact.schema';

const getAll = async (_, res) => {
  const contacts = await Contact.find();
  res.json(contacts);
};

const getById = async (req, res) => {
  const contactId = req.params.contactId;
  const contact = await Contact.findById(contactId);
  if (!contact) throw new HttpError(404, 'Not found');
  res.json(contact);
};

const post = async (req, res) => {
  const validatedBody = UpdateContactDataSchema.parse(req.body);
  const addedContact = await Contact.create(validatedBody);
  res.status(201).json(addedContact);
};

const putById = async (req, res) => {
  const contactId = req.params.contactId;
  const validatedBody = UpdateContactDataSchema.parse(req.body);
  const updatedContact = await Contact.findByIdAndUpdate(contactId, validatedBody);
  if (!updatedContact) throw new HttpError(404, 'Not found');
  res.json(updatedContact);
};

const patchById = async (req, res) => {
  const contactId = req.params.contactId;
  const validatedBody = UpdateFavoriteSchema.parse(req.body);
  const updatedContact = await Contact.findByIdAndUpdate(contactId, validatedBody, { new: true });
  if (!updatedContact) throw new HttpError(404, 'Not found');
  res.json(updatedContact);
};

const deleteById = async (req, res) => {
  const contactId = req.params.contactId;
  const removedContact = await Contact.findByIdAndDelete(contactId);
  if (!removedContact) throw new HttpError(404, 'Not found');
  res.json({ message: 'contact deleted' });
};

export default {
  getAll: handlerWrapper(getAll),
  getById: handlerWrapper(getById),
  post: handlerWrapper(post),
  putById: handlerWrapper(putById),
  patchById: handlerWrapper(patchById),
  deleteById: handlerWrapper(deleteById),
};
