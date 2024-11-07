import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menu } from './menu.entity';
import { User } from '../user/user.entity';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
  ) {}

  async getMenusForUser(user: User): Promise<Menu[]> {
    const userPermissions = user.role.permissions.map((permission) => permission.name);

    return this.menuRepository
      .createQueryBuilder('menu')
      .leftJoinAndSelect('menu.permissions', 'permission')
      .where('permission.name IN (:...permissions)', { permissions: userPermissions })
      .getMany();
  }
}
