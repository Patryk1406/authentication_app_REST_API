var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { hash, compare } from 'bcrypt';
import * as jsonwebtoken from 'jsonwebtoken';
import { UserRecord } from '../records/user.record.js';
import { NoUSerError, ValidationError } from '../utils/errors.js';
export const userRouter = Router();
userRouter.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const autHeader = req.get('Authorization');
    try {
        if (autHeader) {
            const token = req.get('Authorization').split(' ')[1];
            const decodedToken = jsonwebtoken.verify(token, 'ldzAxLmvinv5whm2kgDvPjf7C5m9ngeq1298jdPArNc7lcNyiXxavKXVWi7bD9X');
            const loadedUser = yield UserRecord.getByEmail(decodedToken.email);
            if (loadedUser.isBlocked) {
                res.status(308).json({ redirect: true });
                return;
            }
            const users = yield UserRecord.getAll();
            res.json({ users });
        }
        else {
            res.status(401).end();
        }
    }
    catch (e) {
        next(e);
    }
}));
userRouter.post('/signup', body('email')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield UserRecord.getByEmail(value);
    if (user) {
        throw new Error('E-mail already in use');
    }
    return true;
}))
    .normalizeEmail(), body('name')
    .isLength({ min: 1, max: 50 })
    .withMessage('Your name cannot be an empty string and cannot have more than 50 chars.'), body('password')
    .isLength({ min: 1, max: 50 })
    .withMessage('Your password cannot be an empty string and cannot have more than 50 chars.'), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            throw new ValidationError(result.array()[0].msg);
        }
        const { name, email, password } = req.body;
        const hashedPassword = yield hash(password, 12);
        const newUser = new UserRecord({ name, email, password: hashedPassword });
        yield newUser.save();
        res.status(201).json({ ok: true });
    }
    catch (e) {
        next(e);
    }
}));
userRouter.post('/login', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const loadedUser = yield UserRecord.getByEmail(email);
        if (!loadedUser) {
            throw new NoUSerError('A user with the given email cannot be found in our database.');
        }
        const isEqual = yield compare(password, loadedUser.password);
        if (!isEqual) {
            throw new ValidationError('The password is incorrect');
        }
        if (loadedUser.isBlocked) {
            res.status(308).json({ redirect: true });
            return;
        }
        const token = jsonwebtoken.sign({ email: loadedUser.email, userId: loadedUser.id }, 'ldzAxLmvinv5whm2kgDvPjf7C5m9ngeq1298jdPArNc7lcNyiXxavKXVWi7bD9X', { expiresIn: '1h' });
        loadedUser.lastLoginAt = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`;
        yield loadedUser.update();
        res.status(200).json({ token, userId: loadedUser.id });
    }
    catch (e) {
        next(e);
    }
}));
userRouter.patch('', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const autHeader = req.get('Authorization');
    try {
        if (autHeader) {
            const token = req.get('Authorization').split(' ')[1];
            const decodedToken = jsonwebtoken.verify(token, 'ldzAxLmvinv5whm2kgDvPjf7C5m9ngeq1298jdPArNc7lcNyiXxavKXVWi7bD9X');
            const loadedUser = yield UserRecord.getByEmail(decodedToken.email);
            if (loadedUser.isBlocked) {
                res.status(308).json({ redirect: true });
                return;
            }
            yield UserRecord.block(req.body.ids);
            res.json({ ok: true });
        }
        else {
            res.status(401).end();
        }
    }
    catch (e) {
        next(e);
    }
}));
userRouter.delete('', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const autHeader = req.get('Authorization');
    try {
        if (autHeader) {
            const token = req.get('Authorization').split(' ')[1];
            const decodedToken = jsonwebtoken.verify(token, 'ldzAxLmvinv5whm2kgDvPjf7C5m9ngeq1298jdPArNc7lcNyiXxavKXVWi7bD9X');
            const loadedUser = yield UserRecord.getByEmail(decodedToken.email);
            if (loadedUser.isBlocked) {
                res.status(308).json({ redirect: true });
                return;
            }
            yield UserRecord.delete(req.body.ids);
            res.json({ ok: true });
        }
        else {
            res.status(401).end();
        }
    }
    catch (e) {
        next(e);
    }
}));
//# sourceMappingURL=user.route.js.map