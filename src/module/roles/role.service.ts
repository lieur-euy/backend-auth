import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async findRoleWithPermissions(roleId: number): Promise<Role | undefined> {
    return this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });
  }
}
