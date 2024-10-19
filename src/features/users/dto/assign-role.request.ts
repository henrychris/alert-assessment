import { IsNotEmpty, IsNumber } from 'class-validator';

export class AssignRoleRequest {
  @IsNotEmpty()
  @IsNumber()
  roleId: number;

  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
