import { Controller, Get, Param, ParseIntPipe, Patch, Query, UseGuards, Body, Delete } from '@nestjs/common';
import { Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { AdminGuard } from '../auth/guards/admin.guard';
import { AdminService } from './admin.service';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  listUsers(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize = 10,
    @Query('search') search = '',
  ) {
    return this.adminService.listUsers(Math.max(1, page), Math.min(50, Math.max(1, pageSize)), search);
  }

  @Get('users/:id')
  getUser(@Param('id') id: string) {
    return this.adminService.getUser(id);
  }

  @Patch('users/:id')
  updateUser(@Session() session: UserSession, @Param('id') id: string, @Body() dto: UpdateAdminUserDto) {
    return this.adminService.updateUser(session.user.id, id, dto);
  }

  @Delete('users/:id')
  softDeleteUser(@Session() session: UserSession, @Param('id') id: string) {
    return this.adminService.softDeleteUser(session.user.id, id);
  }

  @Delete('users/:id/permanent')
  permanentlyDeleteUser(@Session() session: UserSession, @Param('id') id: string) {
    return this.adminService.permanentlyDeleteUser(session.user.id, id);
  }
}
