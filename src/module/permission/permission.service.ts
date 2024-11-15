import { Injectable } from '@nestjs/common';
import { permission } from '@prisma/client'; // Prisma otomatis menghasilkan tipe untuk entitas di dalam Prisma Client
import { PrismaService } from 'src/databases/prisma.service';

@Injectable()
export class PermissionService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<permission[]> {
    return this.prisma.permission.findMany(); // Mengambil semua entitas permission
  }
}
