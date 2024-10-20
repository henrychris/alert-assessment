import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../../prisma/prisma.service';
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
    return await this.prisma.user.findMany({
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

  async remove(id: number) {
    const user = await this.prisma.user.findFirst({ where: { id: id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.delete({ where: { id: id } });
  }

  async assignRoleAsync(assignRoleRequest: AssignRoleRequest) {
    const user = await this.prisma.user.findFirst({
      where: { id: assignRoleRequest.userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const role = await this.prisma.role.findFirst({
      where: { id: assignRoleRequest.roleId },
    });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // todo: add api tests, record video
    await this.prisma.user.update({
      where: { id: assignRoleRequest.userId },
      data: { roles: { connect: { id: assignRoleRequest.roleId } } },
    });
  }
}
