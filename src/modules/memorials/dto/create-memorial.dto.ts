import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { EMemorialType } from '../enum/memorial-type.enum';
export class CreateMemorialDto {

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsString()
    names: string;

    @ApiProperty({ required: true, enum: Object.values(EMemorialType) })
    @IsNotEmpty()
    @IsEnum(EMemorialType)
    type: EMemorialType;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsString()
    date_founded: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    former_district?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    former_sector?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    former_cell?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    former_village?: string;
}