import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from 'src/common/dtos/base.dto';

export class IbukaMemberDto extends BaseDto {
    
    @ApiProperty()
    name: string;

    @ApiProperty()
    family_name: string;

    @ApiProperty()
    testimonials: number;

    @ApiProperty()
    death_province?: string;

    @ApiProperty()
    death_district?: string;

    @ApiProperty()
    death_sector?: string;

    @ApiProperty()
    death_cell?: string;

    @ApiProperty()
    death_village?: string;

    @ApiProperty()
    survival_province?: string;

    @ApiProperty()
    survival_district?: string;

    @ApiProperty()
    survival_sector?: string;

    @ApiProperty()
    survival_cell?: string;

    @ApiProperty()
    survival_village?: string;

    @ApiProperty()
    former_district: string;

    @ApiProperty()
    former_sector: string;

    @ApiProperty()
    former_cell: string;

    @ApiProperty()
    former_village: string;
    
}