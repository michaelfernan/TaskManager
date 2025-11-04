import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  
  const config = new DocumentBuilder()
    .setTitle('Task API')
    .setDescription('Documentação do CRUD de Tarefas (REST API)')
    .setVersion('1.0')
    .addTag('tasks')
    .addBearerAuth() 
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000); 
  
  const serverUrl = await app.getUrl();
  console.log(`🚀 Aplicação NestJS rodando em: ${serverUrl}`);
  console.log(`📄 Documentação Swagger (OpenAPI) disponível em: ${serverUrl}/api/docs`);
}

bootstrap();