import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailService } from './mail/mail.service';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [MailModule],
  controllers: [AppController],
  providers: [AppService, MailService],
})
export class AppModule {}
