import { Module } from '@nestjs/common';
import { RoadmapService } from './roadmap.service.js';
import { RoadmapController } from './roadmap.controller.js';
import { DatabaseModule } from '../database/database.module.js';

@Module({
  imports: [DatabaseModule],
  controllers: [RoadmapController],
  providers: [RoadmapService],
})
export class RoadmapModule {}
