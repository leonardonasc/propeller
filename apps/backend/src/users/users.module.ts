import { Module } from '@nestjs/common';
import { UsersController } from './users.controller.js';
import { DatabaseModule } from '../database/database.module.js';
import { UsersService } from './users.service.js';

@Module({
    imports: [DatabaseModule],
    controllers: [UsersController],
    providers: [UsersService],
}) 
export class UsersModule {}
