import { Meta } from 'express-validator';
import { UserRecord } from '../../records/user.record.js';
import { InvalidCredentials, InvalidDataError } from '../errors.js';

export async function checkEmailIfExists(val: string, { req }: Meta) {
  const user = await UserRecord.getOneByEmail(val);
  if (user && req.path === '/signup') return Promise.reject(new InvalidDataError('E-mail already in use'));
  if (!user && req.path === '/login') return Promise.reject(new InvalidCredentials('Please enter a valid password and email address.'));
  return true;
}
