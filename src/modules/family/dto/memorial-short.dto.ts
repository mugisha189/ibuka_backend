import { BaseDto } from "src/common/dtos/base.dto";
import { ApiProperty } from '@nestjs/swagger';

export class MemorialShortDto extends BaseDto {

    @ApiProperty()
    names: string;
    
}