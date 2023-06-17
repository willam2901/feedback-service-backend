import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FeedbacksService } from './feedbacks.service';
import { CreateFeedbackDto } from '@/api/feedback/dto/create-feedback.dto';
import { UpdateFeedbackDto } from '@/api/feedback/dto/update-feedback.dto';
import { EndpointEnum } from '@/app/utils/endpoint.enum';

@Controller()
export class FeedbacksController {
  constructor(private readonly feedbacksService: FeedbacksService) {}

  @MessagePattern(EndpointEnum.FEEDBACK_CREATE)
  create(@Payload() createFeedbackDto: CreateFeedbackDto) {
    return this.feedbacksService.create(createFeedbackDto);
  }

  @MessagePattern(EndpointEnum.FEEDBACK_GET_ALL)
  findAll() {
    return this.feedbacksService.findAll();
  }

  @MessagePattern(EndpointEnum.FEEDBACK_GET)
  findOne(@Payload() id: number) {
    return this.feedbacksService.findOne(id);
  }

  @MessagePattern(EndpointEnum.FEEDBACK_UPDATE)
  update(@Payload() updateFeedbackDto: UpdateFeedbackDto) {
    return this.feedbacksService.update(1, updateFeedbackDto);
  }

  @MessagePattern(EndpointEnum.FEEDBACK_DELETE)
  remove(@Payload() id: number) {
    return this.feedbacksService.remove(id);
  }
}
