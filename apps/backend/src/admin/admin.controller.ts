import { Controller, Get, Param, ParseIntPipe, Patch, Query, UseGuards, Body, Delete } from '@nestjs/common';
import { Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { AdminGuard } from '../auth/guards/admin.guard.js';
import { AdminService } from './admin.service.js';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto.js';
import { ApiCookieAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Admin')
@ApiCookieAuth('session-cookie')
@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  @ApiOperation({ summary: 'Listar usuários, incluindo contas desativadas' })
  @ApiResponse({ status: 403, description: 'Apenas administradores.' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 10, description: 'Limitado a 50.' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Busca por nome ou e-mail.' })
  listUsers(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize = 10,
    @Query('search') search = '',
  ) {
    return this.adminService.listUsers(Math.max(1, page), Math.min(50, Math.max(1, pageSize)), search);
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Obter usuário e projetos associados' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  getUser(@Param('id') id: string) {
    return this.adminService.getUser(id);
  }

  @Patch('users/:id')
  @ApiOperation({ summary: 'Atualizar usuário, banimento ou reativar conta desativada' })
  updateUser(@Session() session: UserSession, @Param('id') id: string, @Body() dto: UpdateAdminUserDto) {
    return this.adminService.updateUser(session.user.id, id, dto);
  }

  @Delete('users/:id')
  @ApiOperation({ summary: 'Desativar conta preservando seus dados' })
  softDeleteUser(@Session() session: UserSession, @Param('id') id: string) {
    return this.adminService.softDeleteUser(session.user.id, id);
  }

  @Delete('users/:id/permanent')
  @ApiOperation({ summary: 'Excluir conta e dados associados permanentemente' })
  permanentlyDeleteUser(@Session() session: UserSession, @Param('id') id: string) {
    return this.adminService.permanentlyDeleteUser(session.user.id, id);
  }
}
