import { Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

class CreateTaskCommentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  content: string;
}

@ApiTags('Tasks')
@Controller('projects/:projectId/tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService
  ) { }

  @Post()
  create(
    @Session() session: UserSession,
    @Param('projectId') projectId: string,
    @Body() dto: CreateTaskDto
  ) {
    return this.tasksService.create(session.user.id, projectId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar tarefas do usuário' })
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
  findComments(@Session() session: UserSession, @Param('projectId') projectId: string, @Param('id') id: string) {
    return this.tasksService.findComments(session.user.id, projectId, id);
  }

  @Post(':id/comments')
  createComment(@Session() session: UserSession, @Param('projectId') projectId: string, @Param('id') id: string, @Body() dto: CreateTaskCommentDto) {
    return this.tasksService.createComment(session.user.id, projectId, id, dto.content);
  }

  @Patch(':id/comments/:commentId')
  updateComment(@Session() session: UserSession, @Param('projectId') projectId: string, @Param('id') id: string, @Param('commentId') commentId: string, @Body() dto: CreateTaskCommentDto) {
    return this.tasksService.updateComment(session.user.id, projectId, id, commentId, dto.content);
  }

  @Delete(':id/comments/:commentId')
  deleteComment(@Session() session: UserSession, @Param('projectId') projectId: string, @Param('id') id: string, @Param('commentId') commentId: string) {
    return this.tasksService.deleteComment(session.user.id, projectId, id, commentId);
  }

  @Patch(':id')
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
  remove(
    @Session() session: UserSession,
    @Param('projectId') projectId: string,
    @Param('id') id: string,
  ) {
    return this.tasksService.remove(session.user.id, projectId, id);
  }
}
