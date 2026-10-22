import { Public, Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { Body, Controller, Get, Patch, Query } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { ApiCookieAuth, ApiOperation, ApiProperty, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

class UpdateProfileDto {
    @ApiProperty({ example: 'Leonardo Silva', maxLength: 80 })
    @IsString() @IsNotEmpty() @MaxLength(80)
    name: string;

    @ApiProperty({ example: 'leonardo_dev', minLength: 3, maxLength: 20 })
    @IsString() @IsNotEmpty() @MaxLength(20)
    username: string;
}

@ApiTags('Users')
@ApiCookieAuth('session-cookie')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('username-availability')
    @ApiOperation({ summary: 'Verificar disponibilidade de nome de usuário' })
    @ApiQuery({ name: 'username', required: true, type: String, example: 'leonardo_dev' })
    checkUsername(@Session() session: UserSession, @Query('username') username = '') {
        return this.usersService.checkUsername(session.user.id, username);
    }

    @Patch('me')
    @ApiOperation({ summary: 'Atualizar nome e nome de usuário da conta atual' })
    @ApiResponse({ status: 409, description: 'Nome de usuário já está em uso.' })
    updateProfile(@Session() session: UserSession, @Body() body: UpdateProfileDto) {
        return this.usersService.updateProfile(session.user.id, body.name, body.username);
    }

    @Get('session')
    @ApiOperation({ summary: 'Obter o perfil da sessão atual (inclui estado de desativação)' })
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
    @ApiOperation({ summary: 'Obter perfil e plano da conta atual' })
    getMe(@Session() session: UserSession) {
        return this.usersService.getMe(session.user.id);
    }
}

