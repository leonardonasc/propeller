import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from "@nestjs/common"

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()

    if (!request.user) {
      throw new ForbiddenException("Usuário não autenticado")
    }

    if (request.user.role !== "admin") {
      throw new ForbiddenException("Acesso restrito a administradores")
    }

    return true
  }
}