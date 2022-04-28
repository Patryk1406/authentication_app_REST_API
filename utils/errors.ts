import { NextFunction, Request, Response } from 'express';

export class InvalidDataError extends Error {}

export class InvalidCredentials extends Error {}

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof InvalidDataError || err instanceof InvalidCredentials) {
    let status = err.message === 'E-mail already in use' ? 409 : 422;
    if (err instanceof InvalidCredentials) status = 401;
    res.status(status).json({ message: err.message });
    return;
  }
  console.error(err);
  res.status(500).json({ message: 'Sorry, we have some internal problems, try again later;)' });
}
