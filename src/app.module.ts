import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FeedbackModule } from './api/feedback/feedback.module';
import { FeedbacksModule } from './microservice/feedbacks/feedbacks.module';
import configs from './app/config';
import { ConfigModule } from '@nestjs/config';
import { TwilioWebhookModule } from '@/api/twilio-webhook/twilio-webhook.module';
import { ChatModule } from './api/chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      load: configs,
      envFilePath: ['.env'],
    }),
    FeedbackModule,
    FeedbacksModule,
    TwilioWebhookModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
