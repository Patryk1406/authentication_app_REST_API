import { v4 as uuid } from 'uuid';
import { FieldPacket } from 'mysql2';
import { pool } from '../db/db.js';
import { UserEntity } from '../types';

export class UserRecord {
  private readonly _id: string;

  private readonly _email: string;

  private readonly _password?: string;

  private readonly _name: string;

  private readonly _registrationAt?: Date;

  private _lastLoginAt?: Date;

  private readonly _isBlocked?: boolean;

  constructor(user: UserEntity) {
    this._id = user.id ?? uuid();
    this._name = user.name;
    this._email = user.email;
    this._password = user.password;
    this._lastLoginAt = user.lastLoginAt ? new Date(user.lastLoginAt) : undefined;
    this._registrationAt = user.registrationAt ? new Date(user.registrationAt) : undefined;
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

  set lastLoginAt(newDate: Date) {
    this._lastLoginAt = newDate;
  }

  get registrationAt() {
    return this._registrationAt;
  }

  get isBlocked(): boolean {
    return this._isBlocked;
  }

  static async getAll() {
    const users = (await pool.execute('SELECT `id`, `name`, `email`, `isBlocked`, `lastLoginAt`, `registrationAt` FROM `users`') as [UserEntity[], FieldPacket[]])[0].map((user) => new UserRecord({
      ...user,
      isBlocked: Boolean(user.isBlocked),
    }));
    return users;
  }

  static async getOneByEmail(email: string): Promise<UserRecord | null> {
    const [user] = (await pool.execute('SELECT * FROM `users` WHERE `email` = :email', {
      email,
    }) as [UserEntity[], FieldPacket[]])[0];
    return user ? new UserRecord({ ...user, isBlocked: Boolean(user.isBlocked) }) : null;
  }

  async save() {
    await pool.execute('INSERT INTO `users` (`id`, `email`, `name`, `password`) VALUES(:id, :email, :name, :password)', {
      id: this._id,
      email: this._email,
      name: this._name,
      password: this._password,
    });
  }

  async update() {
    await pool.execute('UPDATE `users` SET `lastLoginAt` = :lastLoginAt WHERE `id` = :id', {
      lastLoginAt: this._lastLoginAt,
      id: this._id,
    });
  }

  static async updateStatus(ids: string[], block: boolean) {
    const promises = [];
    for (let i = 0; i < ids.length; i += 1) {
      const id = ids[i];
      promises.push(pool.execute('UPDATE `users` SET `isBlocked` = :block WHERE `id` = :id', {
        id,
        block: Number(block),
      }));
    }
    await Promise.all(promises);
  }

  static async delete(ids: string[]) {
    const promises = [];
    for (let i = 0; i < ids.length; i += 1) {
      const id = ids[i];
      promises.push(pool.execute('DELETE FROM `users` WHERE `id` = :id', {
        id,
      }));
    }
    await Promise.all(promises);
  }
}
