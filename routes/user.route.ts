import { Router } from 'express';
import { body, header } from 'express-validator';
import jsonwebtoken from 'jsonwebtoken';
import { UserRecord } from '../records/user.record.js';
import { JWTData } from '../types';
import { signupController } from '../controllers/signup.controller.js';
import { checkEmailInDatabase } from '../utils/validation/checkEmailInDatabase.js';
import { validatePassword } from '../utils/validation/validatePassword.js';
import { loginController } from '../controllers/login.controller.js';
import { checkValidationMiddleware } from '../middlewares/checkValidation.middleware.js';
import { checkIffUserExists } from '../utils/validation/checkIffUserExists.js';
import { getAllUsersController } from '../controllers/getAllUsers.controller.js';

export const userRouter = Router();

userRouter.get(
  '/',
  header('Authorization').custom(checkIffUserExists),
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
  body('email').exists().bail().custom(checkIffUserExists),
  body('password').exists(),
  checkValidationMiddleware,
  loginController,
);

// userRouter.patch('/', async (req, res, next) => {
//   const autHeader = req.get('Authorization');
//   try {
//     if (autHeader) {
//       const token = req.get('Authorization').split(' ')[1];
//       const decodedToken = jsonwebtoken.verify(token, 'ldzAxLmvinv5whm2kgDvPjf7C5m9ngeq1298jdPArNc7lcNyiXxavKXVWi7bD9X');
//       const loadedUser = await UserRecord.getOneByEmail((decodedToken as JWTData).userEmail);
//       if (loadedUser.isBlocked) {
//         res.status(308).json({ redirect: true });
//         return;
//       }
//       const ok = req.body.block
//         ? await UserRecord.block(req.body.ids)
//         : await UserRecord.unblock(req.body.ids);
//       res.json({ ok });
//     } else {
//       res.status(401).end();
//     }
//   } catch (e) {
//     next(e);
//   }
// });

userRouter.delete('/', async (req, res, next) => {
  try {
    const token = req.get('Authorization').split(' ')[1];
    const { userEmail } = jsonwebtoken.verify(token, 'ldzAxLmvinv5whm2kgDvPjf7C5m9ngeq1298jdPArNc7lcNyiXxavKXVWi7bD9X') as JWTData;
    const loadedUser = await UserRecord.getOneByEmail(userEmail);
    if (loadedUser.isBlocked) {
      res.status(308).json({ redirect: true });
      return;
    }
    await UserRecord.delete(req.body.ids);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});
