import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { PaginationDTO } from '@/app/utils/PaginationDTO.dto';

export class ChatFilter extends PaginationDTO {
  @ApiPropertyOptional()
  id?: string;

  @ApiPropertyOptional()
  feedback_id?: string;

  @ApiPropertyOptional()
  message?: string;

  @ApiPropertyOptional()
  sender?: string;

  @ApiPropertyOptional()
  sender_name?: boolean;
}
