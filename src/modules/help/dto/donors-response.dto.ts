import { DonorsDto } from "./donors.dto";
import { ApiProperty } from "@nestjs/swagger";
export class DonorsResponseDto {

    @ApiProperty({ type: [DonorsDto] })
    donors: DonorsDto[];
    
}