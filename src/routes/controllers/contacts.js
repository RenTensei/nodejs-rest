const { Router } = require('express');

const { UpdateContactDataSchema, UpdateFavoriteSchema } = require('../../models/contact.schema');
const handlerWrapper = require('../../helpers/reqHandlerWrapper');
const { Contact } = require('../../models/Contact');
const HttpError = require('../../helpers/HttpError');
const { isValidId } = require('../../middlewares/isValidId');

const router = Router();

router.get(
  '/',
  handlerWrapper(async (_, res) => {
    const contacts = await Contact.find();
    res.json(contacts);
  })
);

router.get(
  '/:contactId',
  isValidId,
  handlerWrapper(async (req, res) => {
    const contactId = req.params.contactId;
    const contact = await Contact.findById(contactId);
    if (!contact) throw new HttpError(404, 'Not found');
    res.json(contact);
  })
);

router.post(
  '/',
  handlerWrapper(async (req, res) => {
    const validatedBody = UpdateContactDataSchema.parse(req.body);
    const addedContact = await Contact.create(validatedBody);
    res.status(201).json(addedContact);
  })
);

router.put(
  '/:contactId',
  isValidId,
  handlerWrapper(async (req, res) => {
    const contactId = req.params.contactId;
    const validatedBody = UpdateContactDataSchema.parse(req.body);
    const updatedContact = await Contact.findByIdAndUpdate(contactId, validatedBody);
    if (!updatedContact) throw new HttpError(404, 'Not found');
    res.json(updatedContact);
  })
);

router.patch(
  '/:contactId',
  isValidId,
  handlerWrapper(async (req, res) => {
    const contactId = req.params.contactId;
    const validatedBody = UpdateFavoriteSchema.parse(req.body);
    const updatedContact = await Contact.findByIdAndUpdate(contactId, validatedBody, { new: true });
    if (!updatedContact) throw new HttpError(404, 'Not found');
    res.json(updatedContact);
  })
);

router.delete(
  '/:contactId',
  isValidId,
  handlerWrapper(async (req, res) => {
    const contactId = req.params.contactId;
    const removedContact = await Contact.findByIdAndDelete(contactId);
    if (!removedContact) throw new HttpError(404, 'Not found');
    res.json({ message: 'contact deleted' });
  })
);

module.exports = router;
