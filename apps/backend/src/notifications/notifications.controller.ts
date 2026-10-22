import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { ApiCookieAuth, ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { AdminGuard } from '../auth/guards/admin.guard.js';
import { NotificationsService } from './notifications.service.js';

class CreateBroadcastDto {
  @ApiProperty({ example: 'Atualização do Propeller' })
  @IsString() @IsNotEmpty() @MaxLength(120)
  title: string;

  @ApiProperty({ example: 'Novidades disponíveis no seu workspace.' })
  @IsString() @IsNotEmpty() @MaxLength(2000)
  message: string;
}

@ApiTags('Notifications')
@ApiCookieAuth('session-cookie')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notifications: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar notificações da conta atual' })
  @ApiResponse({ status: 200, description: 'Até 50 notificações, da mais recente para a mais antiga.' })
  list(@Session() session: UserSession) { return this.notifications.list(session.user.id); }

  @Delete()
  @ApiOperation({ summary: 'Limpar todas as notificações da conta atual' })
  @ApiResponse({ status: 200, description: 'Quantidade de notificações removidas.' })
  clear(@Session() session: UserSession) { return this.notifications.clear(session.user.id); }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Marcar uma notificação como lida' })
  @ApiResponse({ status: 404, description: 'Notificação não encontrada para esta conta.' })
  markRead(@Session() session: UserSession, @Param('id') id: string) { return this.notifications.markRead(session.user.id, id); }

  @Post('broadcast')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Enviar uma notificação para todas as contas ativas (administrador)' })
  @ApiResponse({ status: 201, description: 'Notificação criada para cada conta ativa.' })
  @ApiResponse({ status: 403, description: 'Apenas administradores podem enviar notificações.' })
  broadcast(@Body() dto: CreateBroadcastDto) { return this.notifications.broadcast(dto.title, dto.message); }
}
