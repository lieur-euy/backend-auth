import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Menjadikan PrismaModule sebagai modul global
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Mengekspor PrismaService agar bisa diakses modul lain
})
export class PrismaModule {}
