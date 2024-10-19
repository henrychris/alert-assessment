import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  Post,
  Body,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { RolesGuard } from '../auth/guards/role.guard';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AssignRoleRequest } from './dto/assign-role.request';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    return await this.usersService.findAllAsync();
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  remove(@Param('id') param: number) {
    return this.usersService.remove(param);
  }

  @Post('assign-role')
  @HttpCode(204)
  async assignRole(@Body() assignRoleRequest: AssignRoleRequest) {
    await this.usersService.assignRoleAsync(assignRoleRequest);
    return {};
  }
}
