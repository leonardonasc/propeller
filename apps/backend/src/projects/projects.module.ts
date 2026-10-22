import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service.js';
import { ProjectsController } from './projects.controller.js';
import { DatabaseModule } from '../database/database.module.js';

@Module({
  imports: [DatabaseModule],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule { }
