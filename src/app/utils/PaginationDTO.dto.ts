import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDTO {
  @ApiProperty({ default: 1, required: false })
  @IsOptional()
  public page: number;

  @ApiProperty({ default: 10, required: false })
  @IsOptional()
  public limit: number;

  @ApiProperty({ default: 'createdAt', required: false })
  @IsOptional()
  public sortBy: string;

  @ApiProperty({ default: 'desc', required: false })
  @IsOptional()
  public sortOrder: string;
}
