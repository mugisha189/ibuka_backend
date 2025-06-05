import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsArray } from 'class-validator';

export class CreateTestimonialRequestDto {

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
        type: 'string',
        isArray: true,
    })
    @IsOptional()
    @IsArray()
    testimonial_files?: string[];

}