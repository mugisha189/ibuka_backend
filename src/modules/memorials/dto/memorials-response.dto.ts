import { ApiProperty } from '@nestjs/swagger';
import { MemorialResponseDto } from './memorial-response.dto';
export class MemorialsResponseDto {

    @ApiProperty({ type: [MemorialResponseDto] })
    memorials: MemorialResponseDto[];
    
}