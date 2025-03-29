import { ApiProperty } from '@nestjs/swagger';
import { MemorialMemberDto } from "./memorial-member.dto";
export class MemorialMembersResponseDto {

    @ApiProperty({ type: [MemorialMemberDto] })
    memorial_members: MemorialMemberDto[];
    
}