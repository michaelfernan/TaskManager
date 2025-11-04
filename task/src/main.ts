import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // Configuração do CORS
    cors: {
      // ✅ ALTERADO: Usar 'true' (boolean) ou definir para a porta exata (ex: 'http://localhost:39757').
      // Deixando como 'true' ou '*' no NestJS é o equivalente a liberar tudo no desenvolvimento.
      // O * foi mantido, mas o credentials: true foi removido.
      origin: '*', 
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      allowedHeaders: 'Content-Type, Authorization',
      // ❌ REMOVIDO: credentials: true, (não deve ser usado junto com origin: '*')
    },
  });

  // ... (restante do código)

  // ✅ Validação global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ✅ Swagger
  const config = new DocumentBuilder()
    .setTitle('Task API')
    .setDescription('Documentação do CRUD de Tarefas (REST API)')
    .setVersion('1.0')
    .addTag('tasks')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // ✅ Escuta em todas interfaces (funciona dentro e fora do Docker)
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');

  const serverUrl = await app.getUrl();
  console.log(`🚀 Aplicação NestJS rodando em: ${serverUrl}`);
  console.log(`📄 Swagger disponível em: ${serverUrl}/api/docs`);
}

bootstrap();