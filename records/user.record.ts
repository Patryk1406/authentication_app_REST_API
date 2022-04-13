import { v4 as uuid } from 'uuid';
import { FieldPacket } from 'mysql2';
import { UserEntity } from '../types/user.entity';
import { pool } from '../db/db';

export class UserRecord {
  private readonly _id: string;

  private readonly _email: string;

  private readonly _password?: string;

  private readonly _name: string;

  private _lastLoginAt?: string;

  private _isBlocked?: boolean;

  constructor(user: UserEntity) {
    this._id = user.id ?? uuid();
    this._name = user.name;
    this._email = user.email;
    this._password = user.password;
    this._lastLoginAt = user.lastLoginAt;
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

  get isBlocked(): boolean {
    return this._isBlocked;
  }

  static async getAll() {
    const users = (await pool.execute('SELECT * FROM `users`') as [UserEntity[], FieldPacket[]])[0].map((user) => new UserRecord({
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
    await pool.execute('INSERT INTO `users` (`id`, `email`, `name`, `password`) VALUES(:id, :email, :name, :password)', {
      id: this.id,
      email: this.email,
      name: this.name,
      password: this.password,
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
