export interface UserEntity {
  id?: string;
  email: string;
  password?: string;
  name: string;
  lastLoginAt?: Date;
  registrationAt?: Date;
  isBlocked?: boolean;
}
