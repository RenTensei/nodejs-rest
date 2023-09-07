const { z } = require('zod');

const UserValidationSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const EmailValidationSchema = z.object({
  email: z.string().email(),
});

module.exports = { UserValidationSchema, EmailValidationSchema };
