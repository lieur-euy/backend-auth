import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email }, relations: ['role', 'role.permissions'] });
  }

  async findById(id: number): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id }, relations: ['role', 'role.permissions'] });
  }

  async save(user: User): Promise<User> {
    return this.userRepository.save(user);
  }
  async updateRefreshToken(userId: number, refreshToken: string | null): Promise<void> {
    await this.userRepository.update(userId, { refreshToken, lastRefreshTime: new Date() });
  }
 
}
