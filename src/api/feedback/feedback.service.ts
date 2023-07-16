import { Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class FeedbackService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createFeedbackDto: CreateFeedbackDto) {
    return this.prismaService.feedback.create({ data: createFeedbackDto });
  }

  findAll() {
    return this.prismaService.feedback.findMany();
  }

  findOne(id: string) {
    return this.prismaService.feedback.findFirst({ where: { id } });
  }

  update(id: string, updateFeedbackDto: UpdateFeedbackDto) {
    return this.prismaService.feedback.update({
      where: { id },
      data: updateFeedbackDto,
    });
  }

  remove(id: string) {
    return this.prismaService.feedback.delete({ where: { id } });
  }
}
