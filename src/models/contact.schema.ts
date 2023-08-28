import { z } from 'zod';

export const ContactDataSchema = z.object({
  _id: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  favorite: z.boolean(),
});

export const UpdateContactDataSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
});

export const UpdateFavoriteSchema = z.object({
  favorite: z.boolean(),
});

export type IContactFavorite = z.infer<typeof UpdateFavoriteSchema>;
export type IContactData = z.infer<typeof ContactDataSchema>;
export type IContactDataWithoutId = z.infer<typeof UpdateContactDataSchema>;
