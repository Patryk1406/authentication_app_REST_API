export interface UserEntity {
  id?: string;
  email: string;
  password?: string;
  name: string;
  lastLoginAt?: string;
  registrationAt?: string
  isBlocked?: boolean;
}
