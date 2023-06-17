import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateFeedbackDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  uid: string;

  @ApiProperty({ required: false })
  @IsNotEmpty()
  description: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  rating: number;
}
