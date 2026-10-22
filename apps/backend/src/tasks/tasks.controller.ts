import { Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { ApiCookieAuth, ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { TasksService } from './tasks.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';

class CreateTaskCommentDto {
  @ApiProperty({ example: 'Vou revisar essa tarefa ainda hoje.' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  content: string;
}

@ApiTags('Tasks')
@ApiCookieAuth('session-cookie')
@Controller('projects/:projectId/tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService
  ) { }

  @Post()
  @ApiOperation({ summary: 'Criar tarefa no projeto' })
  @ApiResponse({ status: 404, description: 'Projeto não encontrado.' })
  create(
    @Session() session: UserSession,
    @Param('projectId') projectId: string,
    @Body() dto: CreateTaskDto
  ) {
    return this.tasksService.create(session.user.id, projectId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar tarefas do projeto' })
  findAll(
    @Session() session: UserSession,
    @Param('projectId') projectId: string,
  ) {
    return this.tasksService.findAll(session.user.id, projectId);
  }


  @Get(':id')
  @ApiOperation({ summary: 'Obter detalhes de uma tarefa específica' })
  findOne(
    @Session() session: UserSession,
    @Param('projectId') projectId: string,
    @Param('id') id: string,
  ) {
    return this.tasksService.findOne(session.user.id, projectId, id);
  }

  @Get(':id/comments')
  @ApiOperation({ summary: 'Listar comentários da tarefa' })
  findComments(@Session() session: UserSession, @Param('projectId') projectId: string, @Param('id') id: string) {
    return this.tasksService.findComments(session.user.id, projectId, id);
  }

  @Post(':id/comments')
  @ApiOperation({ summary: 'Adicionar comentário à tarefa' })
  createComment(@Session() session: UserSession, @Param('projectId') projectId: string, @Param('id') id: string, @Body() dto: CreateTaskCommentDto) {
    return this.tasksService.createComment(session.user.id, projectId, id, dto.content);
  }

  @Patch(':id/comments/:commentId')
  @ApiOperation({ summary: 'Editar comentário próprio' })
  updateComment(@Session() session: UserSession, @Param('projectId') projectId: string, @Param('id') id: string, @Param('commentId') commentId: string, @Body() dto: CreateTaskCommentDto) {
    return this.tasksService.updateComment(session.user.id, projectId, id, commentId, dto.content);
  }

  @Delete(':id/comments/:commentId')
  @ApiOperation({ summary: 'Excluir comentário próprio' })
  deleteComment(@Session() session: UserSession, @Param('projectId') projectId: string, @Param('id') id: string, @Param('commentId') commentId: string) {
    return this.tasksService.deleteComment(session.user.id, projectId, id, commentId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar tarefa' })
  update(
    @Session() session: UserSession,
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(
      session.user.id,
      projectId,
      id,
      updateTaskDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir tarefa' })
  remove(
    @Session() session: UserSession,
    @Param('projectId') projectId: string,
    @Param('id') id: string,
  ) {
    return this.tasksService.remove(session.user.id, projectId, id);
  }
}
