import { ApiProperty } from '@nestjs/swagger';
import { IbukaMemberDto } from './ibuka-member.dto';
export class IbukaMembersResponseDto {

    @ApiProperty({ type: [IbukaMemberDto] })
    ibuka_members: IbukaMemberDto[];

}