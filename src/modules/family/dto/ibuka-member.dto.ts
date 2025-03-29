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
    former_district: string;

    @ApiProperty()
    former_sector: string;

    @ApiProperty()
    former_cell: string;

    @ApiProperty()
    former_village: string;
    
}