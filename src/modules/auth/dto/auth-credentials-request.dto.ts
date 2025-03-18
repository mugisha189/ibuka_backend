import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthCredentialsRequestDto {

  @ApiProperty({
    required: true
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'password',
  })
  readonly password: string;

}
