import { NextFunction, Request, Response } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import { JWTData } from '../types/index.js';
import { UserRecord } from '../records/user.record.js';
import { checkIfUserIsBlocked } from '../utils/validation/checkIfUserIsBlocked.js';

export async function getAllUsersController(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await UserRecord.getAll();
    res.json({ users });
  } catch (e) {
    next(e);
  }
}
