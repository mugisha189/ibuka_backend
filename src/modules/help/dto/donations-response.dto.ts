import { ApiProperty } from "@nestjs/swagger";
import { DonationsDto } from "./donations.dto";
export class DonationResponseDto {

    @ApiProperty({ type: [DonationsDto] })
    donations: DonationsDto[];

}