import { Injectable } from '@nestjs/common';
import * as Twilio from 'twilio';

import { PrismaService } from '@/prisma/prisma.service';
import { CommandEnum } from '@/api/twilio-webhook/enum/command.enum';
import { FeedbackService } from '@/api/feedback/feedback.service';

@Injectable()
export class TwilioWebhookService {
  private client: Twilio.Twilio;
  //
  constructor(
    private readonly feedbackService: FeedbackService,
    private readonly prismaService: PrismaService,
  ) {
    this.client = new Twilio.Twilio(
      process.env.TWILIO_SID,
      process.env.TWILIO_TOKEN,
    );
  }

  async support(payload: any) {
    if (payload.Body.toLowerCase() === CommandEnum.RECEIVED) {
      console.log('FEEDBACK');
      console.log(payload);
      let data = await this.prismaService.feedback.create({
        data: {
          uid: payload.WaId,
          name: payload.ProfileName,
          title: payload.Body,
          description: '',
        },
      });
      await this.prismaService.chat.create({
        data: {
          feedback_id: data.id,
          message: data.title,
          sender: payload.WaId,
          sender_name: payload.ProfileName,
        },
      });
      await this.sendMessage(payload);
    } else {
      const lastFeedback = await this.prismaService.feedback.findFirst({
        where: { uid: payload.WaId },
        orderBy: { createdAt: 'desc' },
        take: 1,
      });

      await this.prismaService.chat.create({
        data: {
          feedback_id: lastFeedback.id,
          message: payload.Body,
          sender: payload.WaId,
          sender_name: lastFeedback.name,
        },
      });

      let length = await this.prismaService.chat.count({
        where: { feedback_id: lastFeedback.id },
      });

      let responseMsg = await this.prismaService.command.findFirst({
        take: 1,
        skip: Math.floor(length / 2),
      });

      if (responseMsg !== null) {
        await this.prismaService.chat.create({
          data: {
            feedback_id: lastFeedback.id,
            message: responseMsg.response,
            sender: `${process.env.SENDER_PHONE}`,
            sender_name: `${process.env.SENDER_NAME}`,
          },
        });

        await this.sendWhatsAppMessage(payload.WaId, `${responseMsg.response}`);
      } else if (payload.Body.toLowerCase() === CommandEnum.CLOSE) {
        await this.prismaService.chat.create({
          data: {
            feedback_id: lastFeedback.id,
            message: payload.Body,
            sender: payload.WaId,
            sender_name: lastFeedback.name,
          },
        });
        await this.prismaService.feedback.update({
          where: { id: lastFeedback.id },
          data: { feedbackClosed: true },
        });
      }
    }

    return true;
  }

  async sendWhatsAppMessage(to: string, body: string) {
    try {
      let data = await this.client.messages.create({
        body: body,
        from: `whatsapp:${process.env.SENDER_PHONE}`,
        to: `whatsapp:${to}`,
      });
    } catch (error) {
      console.error('Twilio Error:', error);
    }
  }

  async sendMessage(payload: any) {
    let responseMsg = await this.prismaService.command.findFirst({
      where: {
        command: {
          contains: payload.Body.replace(/\s+/g, ' '),
          mode: 'insensitive',
        },
      },
    });

    const lastFeedback = await this.prismaService.feedback.findFirst({
      where: { uid: payload.WaId },
      orderBy: { createdAt: 'desc' },
      take: 1,
    });

    await this.prismaService.chat.create({
      data: {
        feedback_id: lastFeedback.id,
        message: responseMsg.response,
        sender: `${process.env.SENDER_PHONE}`,
        sender_name: `${process.env.SENDER_NAME}`,
      },
    });

    await this.sendWhatsAppMessage(payload.WaId, `${responseMsg.response}`);
  }
}