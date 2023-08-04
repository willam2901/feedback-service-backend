import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateFeedbackDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  uid: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ required: false })
  @IsNotEmpty()
  description: string;

  @ApiProperty({ required: true, default: 5 })
  @IsOptional()
  rating: number;
}
