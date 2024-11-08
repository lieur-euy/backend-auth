import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { RoleService } from '../roles/role.service';
import { User } from '../user/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly jwtService: JwtService,
  ) {}


  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
  
    if (!user.role) {
      throw new UnauthorizedException('User does not have a role assigned');
    }
  
    // Buat access token dan refresh token
    const payload = { email: user.email, sub: user.id, roles: user.role.name };
    const accessToken = this.jwtService.sign(payload,{ expiresIn: '1m' });
    const refreshToken = this.jwtService.sign(payload, { secret: 'YOUR_REFRESH_SECRET_KEY', expiresIn: '20s' });
  
    // Simpan refresh token yang di-hash di database
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userService.updateRefreshToken(user.id, hashedRefreshToken);
  
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async register(email: string, password: string): Promise<User> {
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const defaultRole = await this.roleService.findRoleWithPermissions(1); // Assign default role
    if (!defaultRole) {
      throw new ConflictException('Default role not found');
    }
    const defaultMenu = await this.roleService.findRoleWithPermissions(1); // Assign default role
    if (!defaultMenu) {
      throw new ConflictException('Default role not found');
    }
    // Hash password menggunakan bcrypt sebelum disimpan
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User();
    newUser.email = email;
    newUser.password = hashedPassword;
    newUser.role = defaultRole;

    return this.userService.save(newUser);
  }
  async refreshAccessToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, { secret: 'YOUR_REFRESH_SECRET_KEY' });
      const user = await this.userService.findById(payload.sub);
  
      if (!user || !user.refreshToken || !(await bcrypt.compare(refreshToken, user.refreshToken))) {
        throw new UnauthorizedException('Invalid refresh token');
      }
  
      // Buat access token baru
      const newAccessToken = this.jwtService.sign({ email: user.email, sub: user.id, roles: user.role.name }, { expiresIn: '1m' });
  
      // Periksa apakah refresh token perlu diperbarui
      const expirationDate = new Date(payload.exp * 1000);
      const now = new Date();
      const timeDifference = expirationDate.getTime() - now.getTime();
      const tenSecondsInMilliseconds = 10 * 1000;
  
      // Jika mendekati kedaluwarsa dan refresh token belum diperbarui dalam 10 detik terakhir, buat refresh token baru
      let newRefreshToken = null;
      if (timeDifference < tenSecondsInMilliseconds) {
        const lastRefreshTime = user.lastRefreshTime ? new Date(user.lastRefreshTime) : null;
        
        // Jika token belum diperbarui dalam 10 detik terakhir, perbarui refresh token
        if (!lastRefreshTime || now.getTime() - lastRefreshTime.getTime() > tenSecondsInMilliseconds) {
          newRefreshToken = this.jwtService.sign({ email: user.email, sub: user.id, roles: user.role.name }, { secret: 'YOUR_REFRESH_SECRET_KEY', expiresIn: '30d' });
          const hashedNewRefreshToken = await bcrypt.hash(newRefreshToken, 10);
          await this.userService.updateRefreshToken(user.id, hashedNewRefreshToken);
        } else {
          newRefreshToken = refreshToken; // Gunakan refresh token yang sama
        }
      } else {
        newRefreshToken = refreshToken; // Jika belum mendekati kedaluwarsa, gunakan refresh token yang sama
      }
  
      return {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
  

}
