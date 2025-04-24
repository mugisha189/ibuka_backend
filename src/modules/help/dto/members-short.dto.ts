import { ApiProperty } from "@nestjs/swagger";
import { BaseDto } from "src/common/dtos/base.dto";
export class MembersShortDto extends BaseDto {

    @ApiProperty()
    member_name: string;
    
}