import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from 'src/common/dtos/base.dto';
export class DonorsDto extends BaseDto {

    @ApiProperty()
    names: string;

    @ApiProperty()
    phone_number: string;

    @ApiProperty()
    national_id: string;

    @ApiProperty()
    helping_resources: number;
    
}
