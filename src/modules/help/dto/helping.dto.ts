import { ApiProperty } from "@nestjs/swagger";
import { BaseDto } from "src/common/dtos/base.dto";
import { BeneficiaryDto } from "./beneficiary.dto";
export class HelpingDto extends BaseDto {

    @ApiProperty()
    items: string;

    @ApiProperty()
    amount: number;

    @ApiProperty()
    remaining_amount: number;

    @ApiProperty()
    given_amount: number;

    @ApiProperty()
    donor_names: string;

    @ApiProperty()
    donorId: string;

    @ApiProperty({ type: [BeneficiaryDto], description: 'List of the beneficiaries' })
    beneficiaries: BeneficiaryDto[];

}