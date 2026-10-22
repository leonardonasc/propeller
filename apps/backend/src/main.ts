import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  app.enableCors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Propeller API')
    .setDescription('API do Propeller para projetos, tarefas, agenda, roadmap, administração e notificações. As rotas privadas usam o cookie de sessão do Better Auth; autentique-se no mesmo domínio da API e use **Authorize** para enviar o cookie durante as chamadas.')
    .setVersion('1.0')
    .addCookieAuth('better-auth.session_token', { type: 'apiKey', in: 'cookie', description: 'Cookie de sessão Better Auth; em HTTPS o nome pode ser __Secure-better-auth.session_token.' }, 'session-cookie')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    jsonDocumentUrl: 'api/docs-json',
    swaggerOptions: { persistAuthorization: true, displayRequestDuration: true, filter: true, tagsSorter: 'alpha', operationsSorter: 'alpha' },
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
