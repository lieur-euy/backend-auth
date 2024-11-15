import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { MenuService } from './menu.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)

  @Get()
  async getAvailableMenus(@Request() req) {
    return this.menuService.getMenusForUser(req.user);
  }
}
