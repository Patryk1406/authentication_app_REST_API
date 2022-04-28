import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { InvalidCredentials, InvalidDataError } from '../utils/errors.js';

export function checkValidationMiddleware(req: Request, res: Response, next: NextFunction) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const firstError = result.array()[0];
    if (firstError.msg === 'PLease enter a valid password and email address.' || firstError.param === 'authorization') throw new InvalidCredentials(firstError.msg);
    throw new InvalidDataError(firstError.msg);
  }
  next();
}
