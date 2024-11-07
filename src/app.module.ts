import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './module/auth/auth.module';
import { UserModule } from './module/user/user.module';
import { RoleModule } from './module/roles/role.module';
import { PermissionModule } from './module/permission/permission.module';
import { MenuModule } from './module/menu/menu.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'yayat123',
      database: 'auth',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Aktifkan untuk membuat tabel secara otomatis
    }),
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
