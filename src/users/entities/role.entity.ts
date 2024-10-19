import { User } from './user.entity';

export class Role {
  id: number;
  name: string;
  permissions: string[];
  users?: User[];
}
