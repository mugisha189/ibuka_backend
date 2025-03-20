import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
export class CreateMemorialDto {

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsString()
    names: string;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsString()
    type: string;

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