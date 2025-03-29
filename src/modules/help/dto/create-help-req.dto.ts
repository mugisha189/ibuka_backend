import { ApiProperty } from "@nestjs/swagger";
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { CreateHelpDto } from "./create-help.dto";
export class CreateHelpRequestDto {

        @ApiProperty({ required: true })
        @IsNotEmpty()
        @IsString()
        donorId: string;

        @ApiProperty({ required: true, type: [CreateHelpDto] })
        @IsNotEmpty()
        @ValidateNested({ each: true })
        @Type(() => CreateHelpDto)
        help: CreateHelpDto[];
}