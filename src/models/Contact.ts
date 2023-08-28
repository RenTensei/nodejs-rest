import { Schema, model } from 'mongoose';
import { IContactData } from './contact.schema';

const contactSchema = new Schema<IContactData>(
  {
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);

export const Contact = model('Contact', contactSchema);
