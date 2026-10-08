import { Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(
    @Session() session: UserSession,
    @Body() dto: CreateProjectDto,
  ) {
    return this.projectsService.create(session.user.id, dto);
  }

  @Get()
  findAll(@Session() session: UserSession) {
    return this.projectsService.findAll(session.user.id);
  }

  @Get(':id')
  findOne(
    @Session() session: UserSession,
    @Param('id') id: string,
  ) {
    return this.projectsService.findOne(session.user.id, id);
  }

  @Patch(':id')
  update(
    @Session() session: UserSession,
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.projectsService.update(
      session.user.id,
      id,
      dto,
    );
  }

  @Delete(':id')
  remove(
    @Session() session: UserSession,
    @Param('id') id: string,
  ) {
    return this.projectsService.remove(session.user.id, id);
  }
}