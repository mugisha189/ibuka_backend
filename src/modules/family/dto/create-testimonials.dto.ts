import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
export class CreateTestimonialsDto {

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsBoolean()
    family_member: boolean;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsString()
    testimonial_names: string;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsString()
    familyId: string;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsString()
    memberId: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    national_id?: string;

    @ApiProperty({
        required: false,
    })
    @IsOptional()
    @Transform(({ value }) => Array.isArray(value) ? value : [value])
    @IsString({ each: true })
    testimonial_files?: string[];

}