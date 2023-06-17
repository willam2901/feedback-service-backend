import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FeedbackModule } from './api/feedback/feedback.module';
import { FeedbacksModule } from './microservice/feedbacks/feedbacks.module';

@Module({
  imports: [FeedbackModule, FeedbacksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
