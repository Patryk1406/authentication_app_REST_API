import { NextFunction, Request, Response } from 'express';
import { UserRecord } from '../records/user.record.js';

interface ReqBody {
  ids: string[],
  block: string,
}

export async function updateStatusController(req: Request, res: Response, next: NextFunction) {
  try {
    const { ids, block } = req.body as ReqBody;
    await UserRecord.updateStatus(ids, JSON.parse(block));
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
}
