import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { PrismaModule } from 'src/databases/prisma.module';

@Module({
  imports: [PrismaModule], // Mengimpor PrismaModule untuk menyediakan PrismaService
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuService],
})
export class MenuModule {}
