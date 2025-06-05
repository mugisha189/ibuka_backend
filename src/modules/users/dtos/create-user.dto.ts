import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { District } from '../enums/district.enum';
import { Province } from '../enums/province.enum';

export class CreateDistrictUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;



  @ApiProperty({ enum: District, required: false })
  @IsOptional()
  @IsEnum(District)
  district?: District;


  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  profile_picture?: string;
} 

export class CreateProvinceUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ enum: Province, required: false })
  @IsOptional()
  @IsEnum(Province)
  province?: Province;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  profile_picture?: string;
} 