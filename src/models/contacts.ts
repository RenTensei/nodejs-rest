import { nanoid } from 'nanoid';
import fs from 'node:fs/promises';
import path from 'node:path';

import { ContactDataSchema, type IContactData, type IContactDataWithoutId } from './contact.schema';
import { HttpError } from '../helpers';

const contactsPath = path.join(__dirname, 'contacts.json');

export const listContacts = async (): Promise<IContactData[]> => {
  const rawData: string = await fs.readFile(contactsPath, 'utf-8');
  const parsedData: unknown[] = JSON.parse(rawData);
  const validatedContacts = parsedData.map(contact => ContactDataSchema.parse(contact));
  return validatedContacts;
};

export const getContactById = async (contactId: string) => {
  const contacts = await listContacts();
  const result = contacts.find(item => item.id === contactId);
  if (!result) throw new HttpError(404, 'Not found');
  return result;
};

export const addContact = async ({ name, email, phone }: IContactDataWithoutId) => {
  const contacts = await listContacts();
  const newContact: IContactData = { id: nanoid(), name, email, phone };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
};

export const removeContact = async (contactId: string) => {
  const contacts = await listContacts();
  const index = contacts.findIndex((item: IContactData) => item.id === contactId);
  if (index === -1) throw new HttpError(404, 'Not found');
  const [result] = contacts.splice(index, 1);
  if (!result) throw new HttpError(404, 'Not found');
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return result;
};

export const updateContact = async (contactId: string, body: IContactDataWithoutId) => {
  const contacts = await listContacts();
  const index = contacts.findIndex((item: IContactData) => item.id === contactId);
  if (index === -1) throw new HttpError(404, 'Not found');
  const newContact: IContactData = { id: contactId, ...body };
  contacts[index] = newContact;
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
};
