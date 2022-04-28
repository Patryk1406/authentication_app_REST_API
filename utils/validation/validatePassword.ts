import PasswordValidator from 'password-validator';
import { InvalidDataError } from '../errors.js';

export function validatePassword(password: string) {
  const schema = new PasswordValidator();

  schema
    .is().min(8)
    .has().uppercase()
    .has().lowercase()
    .has().digits()
    .has().symbols()
    .has().not().spaces();

  if (!schema.validate(password)) throw new InvalidDataError('Invalid password');
  return true;
}
