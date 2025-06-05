import { BaseDto } from "src/common/dtos/base.dto";
import { ApiProperty } from "@nestjs/swagger";
import { EFamilyStatus } from "../enum/family-status.enum";
export class FamilyDto extends BaseDto {

    @ApiProperty()
    family_name: string;

    @ApiProperty()
    members: number;

    @ApiProperty()
    survived: number;

    @ApiProperty()
    status: EFamilyStatus;

    @ApiProperty()
    current_district: string;

    @ApiProperty()
    current_sector: string;

    @ApiProperty()
    current_cell: string;

    @ApiProperty()
    deceased: number;

    @ApiProperty()
    current_village: string;

    @ApiProperty()
    testimonials: number;

}