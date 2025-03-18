import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateTestimonialsDto {

    @ApiProperty({
        required: true
    })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({
        required: true
    })
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({
        required: true
    })
    @IsNotEmpty()
    @IsString()
    testimonials_names: string;

    @ApiProperty({
        required: false
    })
    @IsOptional()
    @IsString()
    national_id?: string;

    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    testimonials: string[];
}