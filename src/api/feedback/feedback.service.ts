import { HttpException, Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { FeedbackFilter } from '../feedback/dto/feedback.filter';
import { AppMessage } from '../../app/utils/messages.enum';
import { HttpStatusCode } from 'axios';

@Injectable()
export class FeedbackService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createFeedbackDto: CreateFeedbackDto) {
    return this.prismaService.feedback.create({ data: createFeedbackDto });
  }

  async findAll(filterQuery: FeedbackFilter) {
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

    const aggregation = [];

    /*Filter*/
    if (filterQuery.id) {
      aggregation.push({
        id: filterQuery.id,
      });
    }
    if (filterQuery.uid) {
      aggregation.push({
        uid: filterQuery.uid,
      });
    }
    if (filterQuery.feedbackClosed) {
      aggregation.push({
        feedbackClosed: filterQuery.feedbackClosed,
      });
    }

    if (filterQuery.title) {
      aggregation.push({
        title: { contains: filterQuery.title, mode: 'insensitive' },
      });
    }

    if (filterQuery.description) {
      aggregation.push({
        description: { contains: filterQuery.description, mode: 'insensitive' },
      });
    }

    /*
     *
     * Pagination Query
     *
     * */
    const data = await this.prismaService.feedback.findMany({
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
      allData = await this.prismaService.feedback.findMany({
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
      allData = await this.prismaService.feedback.findMany({
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
    return this.prismaService.feedback.findFirst({
      where: { id },
      include: {
        chat: true,
      },
    });
  }

  async update(id: string, updateFeedbackDto: UpdateFeedbackDto) {
    const getSupport = await this.prismaService.feedback.findFirst({
      where: { id: id },
    });

    if (!Boolean(getSupport))
      throw new HttpException(AppMessage.NOT_FOUND, HttpStatusCode.NotFound);
    return this.prismaService.feedback.update({
      where: { id: id },
      data: updateFeedbackDto,
    });
  }

  async remove(id: string) {
    const getSupport = await this.prismaService.feedback.findFirst({
      where: { id },
    });

    if (!Boolean(getSupport))
      throw new HttpException(AppMessage.NOT_FOUND, HttpStatusCode.NotFound);

    await this.prismaService.chat.deleteMany({
      where: { feedback_id: id },
    });

    return await this.prismaService.feedback.delete({
      where: { id: id },
    });
  }
}
