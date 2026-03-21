import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // CORS Enabled for frontend connectivity
  app.enableCors();
  
  // Validation definition
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Swagger OpenAPI Setup
  const config = new DocumentBuilder()
    .setTitle('Ficaqui API')
    .setDescription('API centralizada para Gamificação, Rotas e LLM Llama do MVP Ficaqui.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
