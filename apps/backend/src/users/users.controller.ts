import { Public, Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { Controller, Get } from '@nestjs/common';

@Controller('users')
export class UsersController {
    @Get('session')
    getSession(@Session() session: UserSession) {
        return session.user;
    }

    // This endpoint is public and does not require authentication
    @Get('public')
    @Public()
    getPublic() {
        return { message: 'This is a public endpoint' };
    }
}