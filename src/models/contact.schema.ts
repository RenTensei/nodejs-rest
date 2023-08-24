import { z } from 'zod';

export const ContactDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
});

export const UpdateContactDataSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
});

export type IContactData = z.infer<typeof ContactDataSchema>;
export type IContactDataWithoutId = z.infer<typeof UpdateContactDataSchema>;
