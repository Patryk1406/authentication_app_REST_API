import { NextFunction, Request, Response } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import { JWTData } from '../types/index.js';
import { UserRecord } from '../records/user.record.js';
import { checkIfUserIsBlocked } from '../utils/validation/checkIfUserIsBlocked.js';

export async function getAllUsersController(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.get('Authorization').split(' ')[1];
    const { userEmail } = jsonwebtoken.verify(token, 'ldzAxLmvinv5whm2kgDvPjf7C5m9ngeq1298jdPArNc7lcNyiXxavKXVWi7bD9X') as JWTData;
    const loadedUser = await UserRecord.getOneByEmail(userEmail);
    if (await checkIfUserIsBlocked(loadedUser, res)) return;
    const users = await UserRecord.getAll();
    res.json({ users });
  } catch (e) {
    next(e);
  }
}
