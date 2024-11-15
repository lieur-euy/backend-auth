import { Injectable } from '@nestjs/common';

import { menu, user } from '@prisma/client';
import { PrismaService } from 'src/databases/prisma.service';

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) { }

  async getMenusForUser(user: user): Promise<menu[]> {
    // Ambil nama permission yang dimiliki user berdasarkan role mereka
    const userPermissions = await this.prisma.permission.findMany({
      where: {
        roles: {
          some: {
            id: user.role_id,
          },
        },
      },
      select: {
        name: true,
      },
    });

    const permissionNames = userPermissions.map((permission) => permission.name);

    // Ambil menu yang memiliki permission tersebut
    const menus = await this.prisma.menu.findMany({
      where: {
        permissions: {
          some: {
            name: {
              in: permissionNames,
            },
          },
        },
      },
      include: {
        permissions: true, // Menyertakan relasi permission jika diperlukan
      },
    });

    return menus;
  }
}
