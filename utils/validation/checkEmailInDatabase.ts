import { UserRecord } from '../../records/user.record.js';
import { InvalidDataError } from '../errors.js';

export async function checkEmailInDatabase(val: string) {
  const user = await UserRecord.getOneByEmail(val);
  if (user) return Promise.reject(new InvalidDataError('E-mail already in use'));
  return true;
}
