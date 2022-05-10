import { NextFunction, Request, Response } from 'express';
import { hash } from 'bcrypt';
import { UserRecord } from '../records/user.record.js';

interface ReqBody {
  name: string;
  email: string;
  password: string;
}

export async function signupController(req: Request, res: Response, next: NextFunction) {
  const { name, email, password } = req.body as ReqBody;
  const hashedPassword = await hash(password, 12);
  const newUser = new UserRecord({ name, email, password: hashedPassword });
  await newUser.save();
  res.status(201).json({ ok: true });
}
