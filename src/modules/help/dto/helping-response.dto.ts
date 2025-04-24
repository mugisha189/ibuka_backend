import { HelpingDto } from "./helping.dto";
import { ApiProperty } from "@nestjs/swagger";
export class HelpingResponseDto {

    @ApiProperty({ type: [HelpingDto] })
    helpings: HelpingDto[];
    
}