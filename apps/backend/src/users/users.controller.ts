import { Public, Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { Body, Controller, Get, Patch, Query } from '@nestjs/common';
import { UsersService } from './users.service.js';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('username-availability')
    checkUsername(@Session() session: UserSession, @Query('username') username = '') {
        return this.usersService.checkUsername(session.user.id, username);
    }

    @Patch('me')
    updateProfile(@Session() session: UserSession, @Body() body: { name: string; username: string }) {
        return this.usersService.updateProfile(session.user.id, body.name, body.username);
    }

    @Get('session')
    getSession(@Session() session: UserSession) {
        return this.usersService.getMe(session.user.id);
    }

    // This endpoint is public and does not require authentication
    // @Get('public')
    // @Public()
    // getPublic() {
    //     return { message: 'This is a public endpoint' };
    // }

    @Get('me')
    getMe(@Session() session: UserSession) {
        return this.usersService.getMe(session.user.id);
    }
}

