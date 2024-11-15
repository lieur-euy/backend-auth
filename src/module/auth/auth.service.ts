import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { RoleService } from '../roles/role.service';

import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/databases/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const role = await this.prisma.role.findUnique({ where: { id: user.role_id } });
    if (!role) {
      throw new UnauthorizedException('User does not have a role assigned');
    }

    // Create access token and refresh token
    const payload = { email: user.email, sub: user.id, roles: role.name };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1m' });
    const refreshToken = this.jwtService.sign(payload, { secret: 'YOUR_REFRESH_SECRET_KEY', expiresIn: '20s' });

    // Hash and save refresh token
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refresh_token: hashedRefreshToken },
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async register(email: string, password: string) {
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const defaultRole = await this.prisma.role.findUnique({ where: { id: 1 } }); // Assign default role
    if (!defaultRole) {
      throw new ConflictException('Default role not found');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role_id: defaultRole.id,
      },
    });

    return newUser;
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, { secret: 'YOUR_REFRESH_SECRET_KEY' });
      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });

      if (!user || !user.refresh_token || !(await bcrypt.compare(refreshToken, user.refresh_token))) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Create new access token
      const newAccessToken = this.jwtService.sign({ email: user.email, sub: user.id, roles: user.role_id }, { expiresIn: '1m' });

      // Check if the refresh token needs to be updated
      const expirationDate = new Date(payload.exp * 1000);
      const now = new Date();
      const timeDifference = expirationDate.getTime() - now.getTime();
      const tenSecondsInMilliseconds = 10 * 1000;

      let newRefreshToken = refreshToken;
      if (timeDifference < tenSecondsInMilliseconds) {
        const lastRefreshTime = user.last_refresh_time ? new Date(user.last_refresh_time) : null;

        if (!lastRefreshTime || now.getTime() - lastRefreshTime.getTime() > tenSecondsInMilliseconds) {
          newRefreshToken = this.jwtService.sign({ email: user.email, sub: user.id, roles: user.role_id }, { secret: 'YOUR_REFRESH_SECRET_KEY', expiresIn: '30d' });
          const hashedNewRefreshToken = await bcrypt.hash(newRefreshToken, 10);
          await this.prisma.user.update({
            where: { id: user.id },
            data: {
              refresh_token: hashedNewRefreshToken,
              last_refresh_time: new Date(),
            },
          });
        }
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
