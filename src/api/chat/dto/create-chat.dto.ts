import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateChatDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  feedback_id: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  message: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  sender: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  sender_name: string;
}
