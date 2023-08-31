const { Contact } = require('../models/Contact/Contact');
const { HttpError, handlerWrapper } = require('../helpers');
const {
  UpdateContactDataSchema,
  UpdateFavoriteSchema,
} = require('../models/Contact/contact.schema');

const getAll = async (req, res) => {
  const { page = 1, limit = 5, favorite = false } = req.query;
  const skip = (page - 1) * limit;
  const contacts = await Contact.find(
    { owner: req.user._id, favorite },
    '-updatedAt -createdAt -owner',
    {
      skip,
      limit,
    }
  );
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
  const addedContact = await Contact.create({ ...validatedBody, owner: req.user._id });
  res.status(201).json(addedContact);
};

const putById = async (req, res) => {
  const contactId = req.params.contactId;
  const validatedBody = UpdateContactDataSchema.parse(req.body);
  const updatedContact = await Contact.findByIdAndUpdate(contactId, validatedBody, { new: true });
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

module.exports = {
  getAll: handlerWrapper(getAll),
  getById: handlerWrapper(getById),
  post: handlerWrapper(post),
  putById: handlerWrapper(putById),
  patchById: handlerWrapper(patchById),
  deleteById: handlerWrapper(deleteById),
};
