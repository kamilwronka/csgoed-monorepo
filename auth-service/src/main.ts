import { NestFactory, NestApplication } from '@nestjs/core';
import * as helmet from 'helmet';

import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { CORS_OPTIONS } from './config/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('Auth service')
    .setDescription('The auth service API description')
    .setVersion('1.0')
    .addTag('auth')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe());
  app.use(helmet());

  app.enableCors({ ...CORS_OPTIONS });
  await app.listen(process.env.PORT);
}
bootstrap();
