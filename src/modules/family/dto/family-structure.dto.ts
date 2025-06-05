import { BaseDto } from "src/common/dtos/base.dto";
import { ApiProperty } from '@nestjs/swagger';

export class FamilyStructureDto extends BaseDto {

    @ApiProperty()
    parents: number;

    @ApiProperty()
    children: number;

    @ApiProperty()
    sector: string;

    @ApiProperty()
    cell: string;

    @ApiProperty()
    village: string;

    @ApiProperty()
    family_head: string;

    @ApiProperty()
    father: string;

    @ApiProperty()
    mother: string;

    @ApiProperty()
    family_members: string;

    @ApiProperty()
    deceased_members: number;

    @ApiProperty()
    survived: number;

}