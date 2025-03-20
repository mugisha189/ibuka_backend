import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateHelpDto {
    
    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsString()
    items: string;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @Transform(({ value }) => Number(value))
    @IsNumber()
    amount: number;

}