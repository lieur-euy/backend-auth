import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { PermissionModule } from '../permission/permission.module';
import { PrismaModule } from 'src/databases/prisma.module';


@Module({
  imports: [PrismaModule], // Mengimpor PrismaModule untuk menyediakan PrismaService
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
