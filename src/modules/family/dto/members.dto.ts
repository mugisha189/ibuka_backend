import { ApiProperty } from '@nestjs/swagger';
import { EMemberStatus } from '../enum';
import { BaseDto } from 'src/common/dtos/base.dto';
export class MembersDto extends BaseDto {

    @ApiProperty()
    name: string;

    @ApiProperty()
    birth_date: string;

    @ApiProperty()
    death_date: string;

    @ApiProperty()
    profile_picture: string;

    @ApiProperty()
    status: EMemberStatus;


}