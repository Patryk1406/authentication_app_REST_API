import { NextFunction, Request, Response } from 'express';
import { UserRecord } from '../records/user.record.js';

export async function deleteUsersController(req: Request, res: Response, next: NextFunction) {
  await UserRecord.delete(req.body.ids);
  res.json({ ok: true });
}
