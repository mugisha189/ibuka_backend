import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateMemberDto } from "./create-member.dto";
import { CreateFamilyRequestDto } from "./create-family-req.dto";

export class UpdateFamilyDto {

    @ApiProperty({ required: false })
    @IsOptional()
    @ValidateNested()
    @Type(() => CreateFamilyRequestDto)
    family_general?: CreateFamilyRequestDto;

    @ApiProperty({ required: false, type: [CreateMemberDto] })
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreateMemberDto)
    members?: CreateMemberDto[];

}
