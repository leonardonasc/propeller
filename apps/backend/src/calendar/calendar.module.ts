import { Module } from '@nestjs/common';
import { CalendarController } from './calendar.controller.js';
import { CalendarService } from './calendar.service.js';
import { DatabaseModule } from '../database/database.module.js';

@Module({ imports: [DatabaseModule], controllers: [CalendarController], providers: [CalendarService] })
export class CalendarModule {}
