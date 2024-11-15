import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PrismaModule } from 'src/databases/prisma.module';

@Module({
  imports: [PrismaModule], // Mengimpor PrismaModule untuk menyediakan PrismaService
  providers: [PermissionService],
  exports: [ PermissionService],
})
export class PermissionModule {}
