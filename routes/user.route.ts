import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { hash, compare } from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import { UserRecord } from '../records/user.record.js';
import { NoUSerError, ValidationError } from '../utils/errors.js';
import { UserEntity, JWTData } from '../types';

export const userRouter = Router();

userRouter.get('/', async (req, res, next) => {
  const autHeader = req.get('Authorization');
  try {
    if (autHeader) {
      const token = req.get('Authorization').split(' ')[1];
      const decodedToken = jsonwebtoken.verify(token, 'ldzAxLmvinv5whm2kgDvPjf7C5m9ngeq1298jdPArNc7lcNyiXxavKXVWi7bD9X');
      const loadedUser = await UserRecord.getByEmail((decodedToken as JWTData).userEmail);
      if (loadedUser.isBlocked) {
        res.status(308).json({ redirect: true });
        return;
      }
      const users = await UserRecord.getAll();
      res.json({ users });
    } else {
      res.status(401).end();
    }
  } catch (e) {
    next(e);
  }
});

userRouter.post(
  '/signup',
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .custom(async (value) => {
      const user: UserRecord | null = await UserRecord.getByEmail(value);
      if (user) {
        throw new Error('E-mail already in use');
      }
      return true;
    })
    .normalizeEmail(),
  body('name')
    .isLength({ min: 1, max: 50 })
    .withMessage('Your name cannot be an empty string and cannot have more than 50 chars.'),
  body('password')
    .isLength({ min: 1, max: 50 })
    .withMessage('Your password cannot be an empty string and cannot have more than 50 chars.'),
  async (req, res, next) => {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        throw new ValidationError(result.array()[0].msg);
      }
      const { name, email, password } = req.body as UserEntity;
      const hashedPassword = await hash(password, 12);
      const newUser = new UserRecord({ name, email, password: hashedPassword });
      await newUser.save();
      res.status(201).json({ ok: true });
    } catch (e) {
      next(e);
    }
  },
);

userRouter.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const loadedUser = await UserRecord.getByEmail(email);
    if (!loadedUser) {
      throw new NoUSerError('A user with the given email cannot be found in our database.');
    }
    const isEqual = await compare(password, loadedUser.password);
    if (!isEqual) {
      throw new ValidationError('The password is incorrect');
    }
    if (loadedUser.isBlocked) {
      res.status(308).json({ redirect: true });
      return;
    }
    const token = jsonwebtoken.sign(
      { userEmail: loadedUser.email },
      'ldzAxLmvinv5whm2kgDvPjf7C5m9ngeq1298jdPArNc7lcNyiXxavKXVWi7bD9X',
      { expiresIn: '1h' },
    );
    loadedUser.lastLoginAt = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`;
    await loadedUser.update();
    res.status(200).json({ token, userEmail: loadedUser.email });
  } catch (e) {
    next(e);
  }
});

userRouter.patch('', async (req, res, next) => {
  const autHeader = req.get('Authorization');
  try {
    if (autHeader) {
      const token = req.get('Authorization').split(' ')[1];
      const decodedToken = jsonwebtoken.verify(token, 'ldzAxLmvinv5whm2kgDvPjf7C5m9ngeq1298jdPArNc7lcNyiXxavKXVWi7bD9X');
      const loadedUser = await UserRecord.getByEmail((decodedToken as JWTData).userEmail);
      if (loadedUser.isBlocked) {
        res.status(308).json({ redirect: true });
        return;
      }
      await UserRecord.block(req.body.ids);
      res.json({ ok: true });
    } else {
      res.status(401).end();
    }
  } catch (e) {
    next(e);
  }
});

userRouter.delete('', async (req, res, next) => {
  const autHeader = req.get('Authorization');
  try {
    if (autHeader) {
      const token = req.get('Authorization').split(' ')[1];
      const decodedToken = jsonwebtoken.verify(token, 'ldzAxLmvinv5whm2kgDvPjf7C5m9ngeq1298jdPArNc7lcNyiXxavKXVWi7bD9X');
      const loadedUser = await UserRecord.getByEmail((decodedToken as JWTData).userEmail);
      if (loadedUser.isBlocked) {
        res.status(308).json({ redirect: true });
        return;
      }
      await UserRecord.delete(req.body.ids);
      res.json({ ok: true });
    } else {
      res.status(401).end();
    }
  } catch (e) {
    next(e);
  }
});
