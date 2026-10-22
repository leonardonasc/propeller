import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { Public } from '@thallesp/nestjs-better-auth'

import { AdminGuard } from '../auth/guards/admin.guard.js'

import { CreateRoadmapDto } from './dto/create-roadmap.dto.js'
import { UpdateRoadmapDto } from './dto/update-roadmap.dto.js'
import { RoadmapService } from './roadmap.service.js'
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('Roadmap')
@Controller('roadmap')
export class RoadmapController {
  constructor(
    private readonly roadmapService: RoadmapService,
  ) { }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Listar itens públicos do roadmap' })
  findAll() {
    return this.roadmapService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter item do roadmap' })
  findOne(@Param('id') id: string) {
    return this.roadmapService.findOne(id)
  }

  @Post()
  @UseGuards(AdminGuard)
  @ApiCookieAuth('session-cookie')
  @ApiOperation({ summary: 'Criar item do roadmap (administrador)' })
  create(@Body() dto: CreateRoadmapDto) {
    return this.roadmapService.create(dto)
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiCookieAuth('session-cookie')
  @ApiOperation({ summary: 'Atualizar item do roadmap (administrador)' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateRoadmapDto,
  ) {
    return this.roadmapService.update(id, dto)
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiCookieAuth('session-cookie')
  @ApiOperation({ summary: 'Excluir item do roadmap (administrador)' })
  remove(@Param('id') id: string) {
    return this.roadmapService.remove(id)
  }
}
