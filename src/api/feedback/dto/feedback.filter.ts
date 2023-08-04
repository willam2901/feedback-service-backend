import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { PaginationDTO } from '@/app/utils/PaginationDTO.dto';

export class FeedbackFilter extends PaginationDTO {
  @ApiPropertyOptional()
  id?: string;

  @ApiPropertyOptional()
  uid?: string;

  @ApiPropertyOptional()
  title?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  feedbackClosed?: boolean;
}
