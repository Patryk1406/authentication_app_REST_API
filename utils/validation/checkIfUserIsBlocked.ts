import { UserRecord } from '../../records/user.record.js';
import { ForbiddenAccess } from '../errors.js';

export function checkIfUserIsBlocked(user: UserRecord) {
  if (user.isBlocked) throw new ForbiddenAccess('We are sorry, but you don\'t have an access to our resources because you were blocked');
}
