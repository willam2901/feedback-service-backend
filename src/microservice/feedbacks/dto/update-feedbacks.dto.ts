import { PartialType } from '@nestjs/mapped-types';
import { CreateFeedbackDto } from '@/api/feedback/dto/create-feedback.dto';

export class UpdateFeedbacksDto extends PartialType(CreateFeedbackDto) {
  id: number;
}
