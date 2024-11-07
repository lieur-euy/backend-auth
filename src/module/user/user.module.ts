import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controler';


@Module({
  imports: [TypeOrmModule.forFeature([User])], // Pastikan User entity diimpor di sini
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
