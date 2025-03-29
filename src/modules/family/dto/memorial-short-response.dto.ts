import { MemorialShortDto } from "./memorial-short.dto";
import { ApiProperty } from '@nestjs/swagger';

export class MemorialShortResponseDto {

    @ApiProperty({ type: [MemorialShortDto] })
    memorials: MemorialShortDto[];
    
}