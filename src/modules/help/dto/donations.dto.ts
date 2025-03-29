import { BaseDto } from "src/common/dtos/base.dto";
import { ApiProperty } from "@nestjs/swagger";
export class DonationsDto extends BaseDto {

    @ApiProperty()
    item: string;

    @ApiProperty()
    amount: number;

}