import { Module } from '@nestjs/common';
import { TwilioWebhookService } from './twilio-webhook.service';
import { TwilioWebhookController } from './twilio-webhook.controller';
import { PrismaService } from '@/prisma/prisma.service';
import { FeedbackService } from '@/api/feedback/feedback.service';

@Module({
  imports: [],
  controllers: [TwilioWebhookController],
  providers: [TwilioWebhookService, PrismaService, FeedbackService],
})
export class TwilioWebhookModule {}
