import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SeedService {
  constructor(private prisma: PrismaService) {}

  async seedRoles() {
    const roles = [
      { id: 1, name: 'Admin', permissions: ['READ', 'WRITE', 'DELETE'] },
      { id: 2, name: 'User', permissions: ['READ', 'WRITE'] },
      { id: 3, name: 'Guest', permissions: ['READ'] },
    ];

    for (const role of roles) {
      await this.prisma.role.upsert({
        where: { name: role.name },
        update: {},
        create: role,
      });
    }

    console.log('Roles seeded successfully');
  }
}
