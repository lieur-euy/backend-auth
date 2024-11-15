import { Injectable } from '@nestjs/common';
import { user } from '@prisma/client'; // Prisma menyediakan tipe bawaan untuk model
import { PrismaService } from 'src/databases/prisma.service';
import { UserSaveInput } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // Mencari user berdasarkan email dengan relasi role dan permissions
  async findByEmail(email: string): Promise<user | null> {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });
  }

  // Mencari user berdasarkan id dengan relasi role dan permissions
  async findById(id: number): Promise<user | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });
  }

  // Menyimpan user baru atau memperbarui data user
// Menyimpan user baru atau memperbarui data user
async save(userData: UserSaveInput): Promise<user> {
  const { id, ...data } = userData;

  return this.prisma.user.upsert({
    where: { id: id || 0 },
    update: data,
    create: data,
  });
}


  // Memperbarui refresh token untuk user
  async updateRefreshToken(userId: number, refreshToken: string | null): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        refresh_token: refreshToken,
        last_refresh_time: new Date(),
      },
    });
  }
}
