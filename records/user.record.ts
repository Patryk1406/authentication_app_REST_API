import { v4 as uuid } from 'uuid';
import { FieldPacket } from 'mysql2';
import { UserEntity } from '../types/user.entity.js';
import { pool } from '../db/db.js';

export class UserRecord {
  private readonly _id: string;

  private readonly _email: string;

  private readonly _password?: string;

  private readonly _name: string;

  private readonly _registrationAt?: string;

  private _lastLoginAt?: string;

  private readonly _isBlocked?: boolean;

  constructor(user: UserEntity) {
    this._id = user.id ?? uuid();
    this._name = user.name;
    this._email = user.email;
    this._password = user.password;
    this._lastLoginAt = user.lastLoginAt;
    this._registrationAt = user.registrationAt;
    this._isBlocked = user.isBlocked;
  }

  get email(): string {
    return this._email;
  }

  get id(): string {
    return this._id;
  }

  get password(): string {
    return this._password;
  }

  get name(): string {
    return this._name;
  }

  get lastLoginAt(): string {
    return this._lastLoginAt;
  }

  set lastLoginAt(value: string) {
    this._lastLoginAt = value;
  }

  get registrationAt(): string {
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

  static async getByEmail(email: string): Promise<UserRecord | null> {
    const [user] = (await pool.execute('SELECT * FROM `users` WHERE `email` = :email', {
      email,
    }) as [UserEntity[], FieldPacket[]]);
    return user[0] ? new UserRecord({
      ...user[0],
      isBlocked: Boolean(user[0].isBlocked),
    }) : null;
  }

  async save() {
    await pool.execute('INSERT INTO `users` (`id`, `email`, `name`, `password`, `lastLoginAt`, `registrationAt`) VALUES(:id, :email, :name, :password, :lastLoginAt, :registrationAt)', {
      id: this.id,
      email: this.email,
      name: this.name,
      password: this.password,
      lastLoginAt: this.lastLoginAt,
      registrationAt: this.registrationAt,
    });
  }

  async update() {
    await pool.execute('UPDATE `users` SET `lastLoginAt` = :lastLoginAt WHERE `id` = :id', {
      lastLoginAt: this.lastLoginAt,
      id: this.id,
    });
  }

  static async block(ids: string[]) {
    const promises = [];
    for (let i = 0; i < ids.length; i += 1) {
      const id = ids[i];
      promises.push(pool.execute('UPDATE `users` SET `isBlocked` = 1 WHERE `id` = :id', {
        id,
      }));
    }
    await Promise.all(promises);
    return true;
  }

  static async unblock(ids: string[]) {
    const promises = [];
    for (let i = 0; i < ids.length; i += 1) {
      const id = ids[i];
      promises.push(pool.execute('UPDATE `users` SET `isBlocked` = 0 WHERE `id` = :id', {
        id,
      }));
    }
    await Promise.all(promises);
    return true;
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
