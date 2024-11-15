import { Injectable } from '@nestjs/common';
import { role } from '@prisma/client'; // Prisma Client menyediakan tipe otomatis untuk entitas
import { PrismaService } from 'src/databases/prisma.service';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  async findRoleWithPermissions(roleId: number): Promise<role | null> {
    return this.prisma.role.findUnique({
      where: { id: roleId },
      include: { permissions: true }, // Mengikutkan relasi permissions
    });
  }
}
