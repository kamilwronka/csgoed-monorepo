import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { REDIS_HOST, REDIS_PORT } from './config/config';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.REDIS,
      options: {
        url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
      },
    },
  );
  await app.listen(() => {
    Logger.log('Mail service is ready.');
  });
}
bootstrap();
