import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './entities/user.entity';
import { AssignRoleRequest } from './dto/assign-role.request';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createAsync(createUserDto: CreateUserDto): Promise<User> {
    return await this.prisma.user.create({
      data: {
        ...createUserDto,
      },
      include: { roles: true },
    });
  }

  async findAllAsync() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        roles: {
          select: {
            id: true,
            name: true,
            permissions: true,
          },
        },
      },
    });
  }

  async findByEmailAsync(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: {
        email: email,
      },
      include: { roles: true },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  async assignRoleAsync(assignRoleRequest: AssignRoleRequest) {
    // todo: validate user and role exist
    // todo: add api tests
    await this.prisma.user.update({
      where: { id: assignRoleRequest.userId },
      data: { roles: { connect: { id: assignRoleRequest.roleId } } },
    });
  }
}
