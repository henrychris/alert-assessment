import { Role } from './role.entity';

export class User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  roles: Role[];
}
