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
  UseGuards,
} from '@nestjs/common';
import { Public, Roles } from 'nest-keycloak-connect';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { EndpointEnum } from '@/app/utils/endpoint.enum';
import { FeedbackFilter } from '@/api/feedback/dto/feedback.filter';
import AppResponse from '@/app/utils/app-response.class';
import { AppMessage } from '@/app/utils/messages.enum';
import { UserRole } from '@/app/common/user-role.enum';
import { Whoiam } from '@/app/decorators/whoiam-decorator';

@Controller(EndpointEnum.FEEDBACK)
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  create(@Body() createFeedbackDto: CreateFeedbackDto) {
    return this.feedbackService.create(createFeedbackDto);
  }

  @Roles({ roles: [UserRole.ADMIN] })
  @UseGuards(Whoiam)
  @Get()
  async findAll(@Query() query: FeedbackFilter) {
    const data = await this.feedbackService.findAll(query);
    return new AppResponse({
      statusCode: HttpStatus.OK,
      message: AppMessage.FEEDBACK_GET_SUCCESS,
      data,
    });
  }

  @Roles({ roles: [UserRole.ADMIN] })
  @UseGuards(Whoiam)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.feedbackService.findOne(id);
    return new AppResponse({
      statusCode: HttpStatus.OK,
      message: AppMessage.FEEDBACK_GET_SUCCESS,
      data,
    });
  }

  @Roles({ roles: [UserRole.ADMIN] })
  @UseGuards(Whoiam)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateFeedbackDto: UpdateFeedbackDto,
  ) {
    const data = await this.feedbackService.update(id, updateFeedbackDto);
    return new AppResponse({
      statusCode: HttpStatus.OK,
      message: AppMessage.FEEDBACK_UPDATE_SUCCESS,
      data,
    });
  }

  @Roles({ roles: [UserRole.ADMIN] })
  @UseGuards(Whoiam)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.feedbackService.remove(id);
    return new AppResponse({
      statusCode: HttpStatus.OK,
      message: AppMessage.FEEDBACK_DELETE_SUCCESS,
      data,
    });
  }
}
