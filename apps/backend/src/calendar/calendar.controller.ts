import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { IsBoolean, IsISO8601, IsOptional, IsString, MaxLength } from 'class-validator';
import { CalendarService } from './calendar.service.js';
import { ApiCookieAuth, ApiOperation, ApiProperty, ApiPropertyOptional, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

class CreateEventDto {
  @ApiProperty({ example: 'Revisão do projeto' })
  @IsString() @MaxLength(160) title: string;
  @ApiPropertyOptional({ example: 'Alinhar próximos passos.' })
  @IsOptional() @IsString() @MaxLength(2000) description?: string;
  @ApiProperty({ type: String, format: 'date-time', example: '2026-10-25T18:00:00.000Z' })
  @IsISO8601() startsAt: string;
  @ApiPropertyOptional({ default: false })
  @IsOptional() @IsBoolean() allDay?: boolean;
}

@ApiTags('Calendar')
@ApiCookieAuth('session-cookie')
@Controller('calendar/events')
export class CalendarController {
  constructor(private readonly calendar: CalendarService) {}
  @Get() @ApiOperation({ summary: 'Listar eventos da conta em um intervalo opcional' })
  @ApiQuery({ name: 'from', required: false, type: String, description: 'Início do intervalo, em formato ISO 8601.' })
  @ApiQuery({ name: 'to', required: false, type: String, description: 'Fim exclusivo do intervalo, em formato ISO 8601.' })
  list(@Session() session: UserSession, @Query('from') from?: string, @Query('to') to?: string) { return this.calendar.list(session.user.id, from, to); }
  @Post() @ApiOperation({ summary: 'Criar evento na agenda' }) @ApiResponse({ status: 400, description: 'Título ou data inválidos.' })
  create(@Session() session: UserSession, @Body() dto: CreateEventDto) { return this.calendar.create(session.user.id, dto); }
  @Delete(':id') @ApiOperation({ summary: 'Excluir evento próprio' }) @ApiResponse({ status: 404, description: 'Evento não encontrado.' })
  remove(@Session() session: UserSession, @Param('id') id: string) { return this.calendar.remove(session.user.id, id); }
}
