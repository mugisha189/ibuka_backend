import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiUnauthorizedCustomResponse } from 'src/common/decorators/api-unauthorized-custom-response.decorator';
import { ApiForbiddenCustomResponse } from 'src/common/decorators/api-forbidden-custom-response.decorator';
import { ApiOkCustomResponse } from 'src/common/decorators';
import { NullDto } from 'src/common/dtos/null.dto';
import { UsersService } from '../users/users.service';
import { UserDto } from '../users/dtos/user.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { TOKEN_NAME } from 'src/constants';
import { ResponseDto } from 'src/common/dtos';
import { ApiTags } from '@nestjs/swagger';
@Controller({
  path: 'profile',
  version: '1'
})
@ApiTags('Profile')
export class ProfileController {
  constructor(
    private readonly userService: UsersService
  ){}
  @ApiOperation({ description: 'Get user profile' })
  @ApiOkCustomResponse(UserDto)
  @ApiUnauthorizedCustomResponse(NullDto)
  @ApiForbiddenCustomResponse(NullDto)
  @ApiBearerAuth(TOKEN_NAME)
  @Get('/get-profile')
  async getProfile(): Promise<ResponseDto<UserDto>> {
    return this.userService.getProfile();
  }
}