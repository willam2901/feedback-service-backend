import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { EndpointEnum } from '@/app/utils/endpoint.enum';
import { FeedbackFilter } from '@/api/feedback/dto/feedback.filter';
import AppResponse from '@/app/utils/app-response.class';
import { AppMessage } from '@/app/utils/messages.enum';

@Controller(EndpointEnum.FEEDBACK)
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  create(@Body() createFeedbackDto: CreateFeedbackDto) {
    return this.feedbackService.create(createFeedbackDto);
  }

  @Get()
  async findAll(@Query() query: FeedbackFilter) {
    const data = await this.feedbackService.findAll(query);
    return new AppResponse({
      statusCode: HttpStatus.OK,
      message: AppMessage.FEEDBACK_GET_SUCCESS,
      data,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    let data = await this.feedbackService.findOne(id);
    return new AppResponse({
      statusCode: HttpStatus.OK,
      message: AppMessage.FEEDBACK_GET_SUCCESS,
      data,
    });
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateFeedbackDto: UpdateFeedbackDto,
  ) {
    let data = await this.feedbackService.update(id, updateFeedbackDto);
    return new AppResponse({
      statusCode: HttpStatus.OK,
      message: AppMessage.FEEDBACK_UPDATE_SUCCESS,
      data,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    let data = await this.feedbackService.remove(id);
    return new AppResponse({
      statusCode: HttpStatus.OK,
      message: AppMessage.FEEDBACK_DELETE_SUCCESS,
      data,
    });
  }
}
