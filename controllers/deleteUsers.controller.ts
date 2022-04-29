import { NextFunction, Request, Response } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import { JWTData } from '../types/index.js';
import { UserRecord } from '../records/user.record.js';
import { checkIfUserIsBlocked } from '../utils/validation/checkIfUserIsBlocked.js';

export async function deleteUsersController(req: Request, res: Response, next: NextFunction) {
  try {
    await UserRecord.delete(req.body.ids);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
}
