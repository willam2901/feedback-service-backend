import { HttpException, Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { ChatFilter } from '../chat/dto/chat.filter';
import * as Twilio from 'twilio';
import { PrismaService } from '../../prisma/prisma.service';
import { AppMessage } from '../../app/utils/messages.enum';
import { HttpStatusCode } from 'axios';

@Injectable()
export class ChatService {
  private client: Twilio.Twilio;

  constructor(private readonly prismaService: PrismaService) {
    this.client = new Twilio.Twilio(
      process.env.TWILIO_SID,
      process.env.TWILIO_TOKEN,
    );
  }

  async create(createChatDto: CreateChatDto) {
    const findReceiverData = await this.prismaService.chat.findFirst({
      where: { id: createChatDto.feedback_id },
    });

    return this.prismaService.chat.create({
      data: createChatDto,
    });
  }

  async findAll(filterQuery: ChatFilter) {
    if (!filterQuery.page) {
      filterQuery.page = 1;
    }
    if (!filterQuery.limit) {
      filterQuery.limit = 10;
    }
    if (!filterQuery.sortBy) {
      filterQuery.sortBy = 'createdAt';
    }
    if (!filterQuery.sortOrder) {
      filterQuery.sortOrder = 'desc';
    }

    filterQuery.limit = filterQuery.limit === 0 ? 1 : filterQuery.limit;
    filterQuery.page = filterQuery.page === 0 ? 1 : filterQuery.page;

    filterQuery.page = parseInt(String(filterQuery.page));
    filterQuery.limit = parseInt(String(filterQuery.limit));

    // filterQuery.sortBy = parseInt(String(filterQuery.sortBy));
    // filterQuery.sortOrder = parseInt(String(filterQuery.sortOrder));

    const aggregation = [];

    /*Filter*/
    if (filterQuery.id) {
      aggregation.push({
        id: filterQuery.id,
      });
    }
    if (filterQuery.feedback_id) {
      aggregation.push({
        feedback_id: filterQuery.feedback_id,
      });
    }
    if (filterQuery.message) {
      aggregation.push({
        message: { contains: filterQuery.message, mode: 'insensitive' },
      });
    }

    if (filterQuery.sender) {
      aggregation.push({
        sender: { contains: filterQuery.sender, mode: 'insensitive' },
      });
    }

    if (filterQuery.sender_name) {
      aggregation.push({
        sender_name: { contains: filterQuery.sender_name, mode: 'insensitive' },
      });
    }

    /*
     *
     * Pagination Query
     *
     * */
    const data = await this.prismaService.chat.findMany({
      where:
        aggregation.length > 0
          ? {
              OR: aggregation,
            }
          : {},
    });
    const pagination = {
      page: filterQuery.page,
      limit: filterQuery.limit,
      total: data.length,
      totalPages:
        data.length < filterQuery.limit
          ? 1
          : Math.ceil(data.length / filterQuery.limit),
      hasNextPage: data.length / filterQuery.limit > filterQuery.page,
    };

    let allData;
    if (aggregation.length > 0) {
      allData = await this.prismaService.chat.findMany({
        take: pagination.limit,
        skip: (filterQuery.page - 1) * filterQuery.limit,
        where: {
          OR: aggregation,
        },
        orderBy: {
          [filterQuery.sortBy]: filterQuery.sortOrder,
        },
      });
    } else {
      allData = await this.prismaService.chat.findMany({
        take: pagination.limit,
        skip: (filterQuery.page - 1) * filterQuery.limit,
        orderBy: {
          [filterQuery.sortBy]: filterQuery.sortOrder,
        },
      });
    }

    return { ...pagination, allData };
  }

  findOne(id: string) {
    return this.prismaService.chat.findFirst({
      where: { id },
    });
  }

  async update(id: string, updateChatDto: UpdateChatDto) {
    const getSupportDetails = await this.prismaService.chat.findFirst({
      where: { id: id },
    });

    if (!Boolean(getSupportDetails))
      throw new HttpException(AppMessage.NOT_FOUND, HttpStatusCode.NotFound);
    return this.prismaService.chat.update({
      where: { id: id },
      data: updateChatDto,
    });
  }

  async remove(id: string) {
    const getSupportDetails = await this.prismaService.chat.findFirst({
      where: { id },
    });

    if (!Boolean(getSupportDetails))
      throw new HttpException(AppMessage.NOT_FOUND, HttpStatusCode.NotFound);

    return await this.prismaService.chat.delete({
      where: { id: id },
    });
  }
}
