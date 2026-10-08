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

import { AdminGuard } from '../auth/guards/admin.guard'

import { CreateRoadmapDto } from './dto/create-roadmap.dto'
import { UpdateRoadmapDto } from './dto/update-roadmap.dto'
import { RoadmapService } from './roadmap.service'

@Controller('roadmap')
export class RoadmapController {
  constructor(
    private readonly roadmapService: RoadmapService,
  ) { }

  @Get()
  @Public()
  findAll() {
    return this.roadmapService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roadmapService.findOne(id)
  }

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() dto: CreateRoadmapDto) {
    return this.roadmapService.create(dto)
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateRoadmapDto,
  ) {
    return this.roadmapService.update(id, dto)
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string) {
    return this.roadmapService.remove(id)
  }
}