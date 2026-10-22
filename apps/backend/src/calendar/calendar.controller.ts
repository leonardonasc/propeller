import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { IsBoolean, IsISO8601, IsOptional, IsString, MaxLength } from 'class-validator';
import { CalendarService } from './calendar.service.js';

class CreateEventDto {
  @IsString() @MaxLength(160) title: string;
  @IsOptional() @IsString() @MaxLength(2000) description?: string;
  @IsISO8601() startsAt: string;
  @IsOptional() @IsBoolean() allDay?: boolean;
}

@Controller('calendar/events')
export class CalendarController {
  constructor(private readonly calendar: CalendarService) {}
  @Get() list(@Session() session: UserSession, @Query('from') from?: string, @Query('to') to?: string) { return this.calendar.list(session.user.id, from, to); }
  @Post() create(@Session() session: UserSession, @Body() dto: CreateEventDto) { return this.calendar.create(session.user.id, dto); }
  @Delete(':id') remove(@Session() session: UserSession, @Param('id') id: string) { return this.calendar.remove(session.user.id, id); }
}
