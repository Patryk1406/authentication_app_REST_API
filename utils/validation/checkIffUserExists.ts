import { Meta } from 'express-validator';
import jsonwebtoken from 'jsonwebtoken';
import { UserRecord } from '../../records/user.record.js';
import { InvalidCredentials } from '../errors.js';
import { JWTData } from '../../types/index.js';

export async function checkIffUserExists(value: string, { location }: Meta) {
  let user: null | UserRecord;
  if (location === 'headers') {
    try {
      const token = value.split(' ')[1];
      const { userEmail } = jsonwebtoken.verify(token, 'ldzAxLmvinv5whm2kgDvPjf7C5m9ngeq1298jdPArNc7lcNyiXxavKXVWi7bD9X') as JWTData;
      user = await UserRecord.getOneByEmail(userEmail);
    } catch (e) {
      return Promise.reject(new InvalidCredentials('We were not able to authenticate you properly'));
    }
  } else user = await UserRecord.getOneByEmail(value);
  if (!user) return Promise.reject(new InvalidCredentials('PLease enter a valid password and email address.'));
  return true;
}
