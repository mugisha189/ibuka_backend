import { ApiProperty } from "@nestjs/swagger";
import { BaseDto } from "src/common/dtos/base.dto";
export class TestimonialsDto extends BaseDto {

    @ApiProperty()
    title: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    family_member: string;

    @ApiProperty()
    testimonial_names: string;

    @ApiProperty()
    testimonial_files: string[];

    @ApiProperty()
    id: string;

    @ApiProperty()
    national_id: string;

    @ApiProperty()
    familyId: string;

    @ApiProperty()
    memberId: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
    
}