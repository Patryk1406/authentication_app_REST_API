var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { v4 as uuid } from 'uuid';
import { pool } from '../db/db.js';
export class UserRecord {
    constructor(user) {
        var _a;
        this._id = (_a = user.id) !== null && _a !== void 0 ? _a : uuid();
        this._name = user.name;
        this._email = user.email;
        this._password = user.password;
        this._lastLoginAt = user.lastLoginAt;
        this._registrationAt = user.registrationAt;
        this._isBlocked = user.isBlocked;
    }
    get email() {
        return this._email;
    }
    get id() {
        return this._id;
    }
    get password() {
        return this._password;
    }
    get name() {
        return this._name;
    }
    get lastLoginAt() {
        return this._lastLoginAt;
    }
    set lastLoginAt(value) {
        this._lastLoginAt = value;
    }
    get isBlocked() {
        return this._isBlocked;
    }
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = (yield pool.execute('SELECT `id`, `name`, `email`, `isBlocked`, `lastLoginAt`, `registrationAt` FROM `users`'))[0].map((user) => new UserRecord(Object.assign(Object.assign({}, user), { isBlocked: Boolean(user.isBlocked) })));
            return users;
        });
    }
    static getByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const [user] = yield pool.execute('SELECT * FROM `users` WHERE `email` = :email', {
                email,
            });
            return user[0] ? new UserRecord(Object.assign(Object.assign({}, user[0]), { isBlocked: Boolean(user[0].isBlocked) })) : null;
        });
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            yield pool.execute('INSERT INTO `users` (`id`, `email`, `name`, `password`) VALUES(:id, :email, :name, :password)', {
                id: this.id,
                email: this.email,
                name: this.name,
                password: this.password,
            });
        });
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            yield pool.execute('UPDATE `users` SET `lastLoginAt` = :lastLoginAt WHERE `id` = :id', {
                lastLoginAt: this.lastLoginAt,
                id: this.id,
            });
        });
    }
    static block(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            const promises = [];
            for (let i = 0; i < ids.length; i += 1) {
                const id = ids[i];
                promises.push(pool.execute('UPDATE `users` SET `isBlocked` = 1 WHERE `id` = :id', {
                    id,
                }));
            }
            yield Promise.all(promises);
            return true;
        });
    }
    static unblock(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            const promises = [];
            for (let i = 0; i < ids.length; i += 1) {
                const id = ids[i];
                promises.push(pool.execute('UPDATE `users` SET `isBlocked` = 0 WHERE `id` = :id', {
                    id,
                }));
            }
            yield Promise.all(promises);
            return true;
        });
    }
    static delete(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            const promises = [];
            for (let i = 0; i < ids.length; i += 1) {
                const id = ids[i];
                promises.push(pool.execute('DELETE FROM `users` WHERE `id` = :id', {
                    id,
                }));
            }
            yield Promise.all(promises);
        });
    }
}
//# sourceMappingURL=user.record.js.map