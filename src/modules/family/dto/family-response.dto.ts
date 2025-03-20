import { FamilyDto } from "./family.dto";
import { ApiProperty } from '@nestjs/swagger';
export class FamilyResponseDto {

    @ApiProperty({ type: [FamilyDto] })
    families: FamilyDto[];
    
}