import { ApiProperty } from "@nestjs/swagger";
import { BaseDto } from "src/common/dtos/base.dto";
export class MemorialDto extends BaseDto {

    @ApiProperty()
    name: string;

    @ApiProperty()
    family: string;

    @ApiProperty()
    birth_date: string;

    @ApiProperty()
    remembrance_day: string;

    @ApiProperty()
    former_residence: string;

}