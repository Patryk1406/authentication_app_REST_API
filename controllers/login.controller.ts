import jsonwebtoken from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { compare } from 'bcrypt';
import { UserRecord } from '../records/user.record.js';
import { InvalidCredentials } from '../utils/errors.js';

interface ReqBody {
  email: string;
  password: string;
}

export async function loginController(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body as ReqBody;
  const loadedUser = await UserRecord.getOneByEmail(email);
  const isEqual = await compare(password, loadedUser.password);
  if (!isEqual) throw new InvalidCredentials('Please enter a valid password and email address.');
  const token = jsonwebtoken.sign(
    { userEmail: loadedUser.email },
    'ldzAxLmvinv5whm2kgDvPjf7C5m9ngeq1298jdPArNc7lcNyiXxavKXVWi7bD9X',
    { expiresIn: '1h' },
  );
  loadedUser.lastLoginAt = new Date();
  await loadedUser.update();
  res.status(200).json({ token, expirationTime: Date.now() + 3600 * 1000 });
}
