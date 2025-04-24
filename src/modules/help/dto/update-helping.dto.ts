import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsNumber } from 'class-validator';
import { Transform } from "class-transformer";
export class UpdateHelpingDto {

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    items?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @Transform(({ value }) => Number(value))
    @IsNumber()
    amount?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @Transform(({ value }) => Number(value))
    @IsNumber()
    remaining_amount?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @Transform(({ value }) => Number(value))
    @IsNumber()
    given_amount?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    donorId?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @Transform(({ value }) => Array.isArray(value) ? value: [value])
    @IsString({ each: true })
    family_beneficiaries?: string[];

    @ApiProperty({ required: false })
    @IsOptional()
    @Transform(({ value }) => Array.isArray(value) ? value: [value])
    @IsString({ each: true })
    member_beneficiaries?: string[];

}