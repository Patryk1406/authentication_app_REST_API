import jsonwebtoken from 'jsonwebtoken';
import { UserRecord } from '../../records/user.record.js';
import { InvalidCredentials } from '../errors.js';
import { JWTData } from '../../types';
import { checkIfUserIsBlocked } from './checkIfUserIsBlocked.js';

export async function validateTokenAndEligibilityOfUser(val: string) {
  let user: null | UserRecord;
  try {
    const token = val.split(' ')[1];
    const { userEmail } = jsonwebtoken.verify(token, 'ldzAxLmvinv5whm2kgDvPjf7C5m9ngeq1298jdPArNc7lcNyiXxavKXVWi7bD9X') as JWTData;
    user = await UserRecord.getOneByEmail(userEmail);
  } catch (e) {
    return Promise.reject(new InvalidCredentials('We were not able to authenticate you properly. Please sign in to your account again.'));
  }
  try {
    checkIfUserIsBlocked(user);
  } catch (e) {
    return Promise.reject(e);
  }
  return true;
}
