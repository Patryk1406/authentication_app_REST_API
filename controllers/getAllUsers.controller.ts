import { NextFunction, Request, Response } from 'express';
import { UserRecord } from '../records/user.record.js';

export async function getAllUsersController(req: Request, res: Response, next: NextFunction) {
  const users = await UserRecord.getAll();
  res.json({ users });
}
