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
  Query,
} from '@nestjs/common';

import { ProjectsService } from './projects.service.js';
import { CreateProjectDto } from './dto/create-project.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';
import { ApiCookieAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Projects')
@ApiCookieAuth('session-cookie')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar projeto para a conta atual' })
  @ApiResponse({ status: 201, description: 'Projeto criado.' })
  @ApiResponse({ status: 403, description: 'Limite de projetos ativos atingido.' })
  create(
    @Session() session: UserSession,
    @Body() dto: CreateProjectDto,
  ) {
    return this.projectsService.create(session.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar projetos da conta atual' })
  @ApiResponse({ status: 200, description: 'Projetos com suas tarefas; use archived=true para projetos arquivados.' })
  @ApiQuery({ name: 'archived', required: false, type: Boolean, description: 'Quando true, retorna apenas projetos arquivados.' })
  findAll(@Session() session: UserSession, @Query('archived') archived?: string) {
    return this.projectsService.findAll(session.user.id, archived === 'true');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter projeto e tarefas por ID' })
  @ApiResponse({ status: 404, description: 'Projeto não encontrado.' })
  findOne(
    @Session() session: UserSession,
    @Param('id') id: string,
  ) {
    return this.projectsService.findOne(session.user.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar ou arquivar projeto' })
  @ApiResponse({ status: 404, description: 'Projeto não encontrado.' })
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
  @ApiOperation({ summary: 'Excluir projeto' })
  @ApiResponse({ status: 404, description: 'Projeto não encontrado.' })
  remove(
    @Session() session: UserSession,
    @Param('id') id: string,
  ) {
    return this.projectsService.remove(session.user.id, id);
  }
}
