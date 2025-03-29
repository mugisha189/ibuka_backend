import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
export class CreateDonorDto {

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsString()
    names: string;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsString()
    phone_number: string;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsString()
    national_id: string;
    
}