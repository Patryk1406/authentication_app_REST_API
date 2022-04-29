import { Router } from 'express';
import { body, header } from 'express-validator';
import { signupController } from '../controllers/signup.controller.js';
import { checkEmailInDatabase } from '../utils/validation/checkEmailInDatabase.js';
import { validatePassword } from '../utils/validation/validatePassword.js';
import { loginController } from '../controllers/login.controller.js';
import { checkValidationMiddleware } from '../middlewares/checkValidation.middleware.js';
import { checkIffUserExistsAndIsEligible } from '../utils/validation/checkIffUserExistsAndIsEligible.js';
import { getAllUsersController } from '../controllers/getAllUsers.controller.js';
import { deleteUsersController } from '../controllers/deleteUsers.controller.js';
import { updateStatusController } from '../controllers/updateStatus.controller.js';

export const userRouter = Router();

userRouter.get(
  '/',
  header('Authorization').custom(checkIffUserExistsAndIsEligible),
  checkValidationMiddleware,
  getAllUsersController,
);

userRouter.post(
  '/signup',
  body('email').isEmail().bail().custom(checkEmailInDatabase).normalizeEmail(),
  body('name', 'Invalid user\'s name').isLength({ min: 2, max: 60 }).matches(/^\p{L}+$/u).escape().trim(),
  body('password').custom(validatePassword),
  signupController,
);

userRouter.post(
  '/login',
  body('email').isEmail().bail().custom(checkIffUserExistsAndIsEligible),
  body('password').isString(),
  checkValidationMiddleware,
  loginController,
);

userRouter.patch(
  '/',
  header('Authorization').custom(checkIffUserExistsAndIsEligible),
  body('ids').isArray(),
  body('block').isBoolean(),
  checkValidationMiddleware,
  updateStatusController,
);

userRouter.delete(
  '/',
  header('Authorization').custom(checkIffUserExistsAndIsEligible),
  body('ids').isArray(),
  checkValidationMiddleware,
  deleteUsersController,
);
