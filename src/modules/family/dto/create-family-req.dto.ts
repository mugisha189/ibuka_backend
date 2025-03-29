import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class CreateFamilyRequestDto {

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsString()
    family_name: string;

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