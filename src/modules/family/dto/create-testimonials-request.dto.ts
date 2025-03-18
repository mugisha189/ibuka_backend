import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateTestimonialsRequestDto {

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
        type: 'string',
        format: 'binary',
        isArray: true,
    })
    @IsNotEmpty()
    testimonials: Express.Multer.File[];
}