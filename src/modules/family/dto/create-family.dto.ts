import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateMemberDto } from "./create-member.dto";

export class CreateFamilyDto {

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

    @ApiProperty({ required: true, type: [CreateMemberDto] })
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CreateMemberDto)
    members: CreateMemberDto[];
    
}