import { Router } from 'express';
import { body, header } from 'express-validator';
import { signupController } from '../controllers/signup.controller.js';
import { checkEmailIfExists } from '../utils/validation/checkEmailIIfExists.js';
import { validatePassword } from '../utils/validation/validatePassword.js';
import { loginController } from '../controllers/login.controller.js';
import { checkValidationMiddleware } from '../middlewares/checkValidation.middleware.js';
import { validateTokenAndEligibilityOfUser } from '../utils/validation/validateTokenAndEligibilityOfUser.js';
import { getAllUsersController } from '../controllers/getAllUsers.controller.js';
import { deleteUsersController } from '../controllers/deleteUsers.controller.js';
import { updateStatusController } from '../controllers/updateStatus.controller.js';

export const userRouter = Router();

userRouter.get(
  '/',
  header('Authorization').custom(validateTokenAndEligibilityOfUser),
  checkValidationMiddleware,
  getAllUsersController,
);

userRouter.post(
  '/signup',
  body('email').isEmail().bail().normalizeEmail().custom(checkEmailIfExists),
  body('name', 'Invalid user\'s name').isLength({ min: 2, max: 60 }).matches(/^\p{L}+$/u).escape().trim(),
  body('password').custom(validatePassword),
  checkValidationMiddleware,
  signupController,
);

userRouter.post(
  '/login',
  body('email').isEmail().bail().custom(checkEmailIfExists).normalizeEmail(),
  body('password').isString(),
  checkValidationMiddleware,
  loginController,
);

userRouter.patch(
  '/',
  header('Authorization').custom(validateTokenAndEligibilityOfUser),
  body('ids').isArray(),
  body('block').isBoolean(),
  checkValidationMiddleware,
  updateStatusController,
);

userRouter.delete(
  '/',
  header('Authorization').custom(validateTokenAndEligibilityOfUser),
  body('ids').isArray(),
  checkValidationMiddleware,
  deleteUsersController,
);
