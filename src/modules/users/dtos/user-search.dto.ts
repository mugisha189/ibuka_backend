import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UserSearchDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty()
  @IsNumber()
  page: number;

  @ApiProperty()
  @IsNumber()
  limit: number;
} 