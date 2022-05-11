import { NextFunction, Request, Response } from 'express';
import { UserRecord } from '../records/user.record.js';
import { UserEntity } from '../types';

export async function getAllUsersController(req: Request, res: Response, next: NextFunction) {
  const users = await UserRecord.getAll();
  const normalizedUsers: UserEntity[] = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    lastLoginAt: user.lastLoginAt,
    registrationAt: user.registrationAt,
    isBlocked: user.isBlocked,
  }));
  res.json({ users: normalizedUsers });
}
