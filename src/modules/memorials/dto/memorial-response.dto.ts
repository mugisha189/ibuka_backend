import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from 'src/common/dtos/base.dto';
export class MemorialResponseDto extends BaseDto {

    @ApiProperty()
    names: string;

    @ApiProperty()
    date_founded: string;

    @ApiProperty()
    former_district: string;

    @ApiProperty()
    bodies: number;
    
}