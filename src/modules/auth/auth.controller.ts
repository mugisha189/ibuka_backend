import { Controller, Post, Get, HttpCode, ValidationPipe, HttpStatus, Body, Headers } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ResponseDto } from 'src/common/dtos';
import { NullDto } from 'src/common/dtos/null.dto';
import { Ip } from 'src/common/decorators';
import { TOKEN_NAME } from 'src/constants';
import { LoginResponseDto } from './dto';
import { AuthCredentialsRequestDto } from './dto';
import { AuthService } from './auth.service';
import { RefreshTokenRequestDto } from '../tokens/dto/refresh-token-request.dto';
import { TokenResponseDto } from '../tokens/dto/token-response.dto';
import { ApiOkCustomResponse } from 'src/common/decorators';
import { Public } from './decorators';

@Controller({
  path: 'auth',
  version: '1'
})
@ApiTags('Auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService
  ){}

    @ApiOkCustomResponse(LoginResponseDto)
    @HttpCode(HttpStatus.OK)
    @Post('/login')
    @Public()
    login(
      @Body(ValidationPipe) authCredentialsDto: AuthCredentialsRequestDto,
      @Ip() ip: string,
      @Headers('user-agent') ua: string,
    ): Promise<ResponseDto<LoginResponseDto>> {
      return this.authService.login(authCredentialsDto, ip, ua);
    }

    @Post('/refresh-token')
    @Public()
    @HttpCode(HttpStatus.OK)
    @ApiOkCustomResponse(TokenResponseDto)
    refreshToken(
      @Body() refreshTokenDto: RefreshTokenRequestDto,
    ): Promise<ResponseDto<TokenResponseDto>> {
      return this.authService.refreshAccessToken(refreshTokenDto);
    }

    @Get('/logout')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth(TOKEN_NAME)
    @ApiOkCustomResponse(NullDto)
    logout(): Promise<ResponseDto<null>> {
      return this.authService.logout();
    }
  
    @Get('/logout/all')
    @ApiBearerAuth(TOKEN_NAME)
    @ApiOkCustomResponse(NullDto)
    @HttpCode(HttpStatus.OK)
    logoutAll(): Promise<ResponseDto<null>> {
      return this.authService.logoutAll();
    }


}