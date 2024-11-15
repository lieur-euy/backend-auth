import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './module/auth/auth.module';
import { UserModule } from './module/user/user.module';
import { RoleModule } from './module/roles/role.module';
import { PermissionModule } from './module/permission/permission.module';
import { MenuModule } from './module/menu/menu.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UserModule,
    RoleModule,
    PermissionModule,
    MenuModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
