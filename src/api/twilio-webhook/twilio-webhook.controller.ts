import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { TwilioWebhookService } from '@/api/twilio-webhook/twilio-webhook.service';

@Controller('twilio-webhook')
export class TwilioWebhookController {
  constructor(private readonly twilioWebhookService: TwilioWebhookService) {}

  @Post('incoming')
  async handleIncomingWhatsAppMessage(@Body() payload: any) {
    const { From, Body: messageBody } = payload;
    await this.twilioWebhookService.support(payload);
    return { success: true };
  }
}
