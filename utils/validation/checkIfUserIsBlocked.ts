import { Response } from 'express';
import { UserRecord } from '../../records/user.record.js';

export async function checkIfUserIsBlocked(user: UserRecord, res: Response) {
  if (user.isBlocked) {
    res.status(403).json({ redirect: true });
    return true;
  }
  return false;
}
