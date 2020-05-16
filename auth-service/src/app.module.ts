import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DB_HOST, DB_PORT, DB_NAME } from './config/config';
import { UsersService } from './users/users.service';

@Module({
  imports: [
    MongooseModule.forRoot(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
