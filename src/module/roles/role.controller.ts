import { Controller, Get, Param } from '@nestjs/common';
import { RoleService } from './role.service';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get(':id')
  async getRoleById(@Param('id') id: string) {
    return this.roleService.findRoleWithPermissions(Number(id));
  }
}
