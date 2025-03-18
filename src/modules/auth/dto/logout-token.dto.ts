import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from 'class-validator';

export class LogoutTokenDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    tokenId: string;

}