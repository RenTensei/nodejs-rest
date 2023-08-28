import { Schema, model } from 'mongoose';
import { IContactData } from './contact.schema';

const contactSchema = new Schema<IContactData>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { versionKey: false, timestamps: true }
);

export const Contact = model('Contact', contactSchema);
