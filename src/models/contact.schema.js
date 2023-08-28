const { z } = require('zod');

const ContactDataSchema = z.object({
  _id: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  favorite: z.boolean(),
});

const UpdateContactDataSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
});

const UpdateFavoriteSchema = z.object({
  favorite: z.boolean(),
});

module.exports = {
  ContactDataSchema,
  UpdateContactDataSchema,
  UpdateFavoriteSchema,
};
