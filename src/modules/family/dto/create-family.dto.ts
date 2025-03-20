import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateMemberDto } from "./create-member.dto";
import { CreateFamilyRequestDto } from "./create-family-req.dto";

export class CreateFamilyDto {

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CreateFamilyRequestDto)
    family_general: CreateFamilyRequestDto;

    @ApiProperty({ required: true, type: [CreateMemberDto] })
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CreateMemberDto)
    members: CreateMemberDto[];
    
}