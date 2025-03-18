import { Injectable, Inject, Scope } from '@nestjs/common';
import { UserRepository } from '../users/model/user.repository';
import { ResponseDto } from 'src/common/dtos';
import { TokensService } from '../tokens/token.service';
import { UserRequest } from 'src/types/request';
import { ResponseService } from 'src/shared/response/response.service';
import { REQUEST } from '@nestjs/core';
import { AuthCredentialsRequestDto } from './dto';
import { loginTemplate } from 'src/templates/auth';
import { BadRequestCustomException, NotFoundCustomException } from 'src/common/http';
import { UserEntity } from '../users/model/user.entity';
import { MailerService } from 'src/shared/mailer/mailer.service';
import { LoginResponseDto } from './dto';
import { HttpException } from '@nestjs/common';
import { jwtDecode } from 'jwt-decode';
import { TokenResponseDto } from '../tokens/dto/token-response.dto';
import { RefreshTokenRequestDto } from '../tokens/dto/refresh-token-request.dto';
import { UsersMapper } from '../users/users.mapper';
import { LoginLogService } from '../login-logs/login-log.service';
import { UserStatus } from '../users/enums/user-status.enum';
import { CustomException } from 'src/common/http/exceptions/custom.exception';
import { TokenRepository } from '../tokens/model/token.repository';

@Injectable({ scope: Scope.REQUEST })
export class AuthService {

  constructor(
    @Inject(REQUEST) private readonly req: UserRequest,
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokensService,
    private readonly responseService: ResponseService,
    private readonly mailService: MailerService,
    private readonly loginLogService: LoginLogService,
    private readonly tokenRepository: TokenRepository,
  ){}

  /**
     * User authentication
     * @param authCredentialsDto {AuthCredentialsRequestDto}
     * @returns {Promise<LoginResponseDto>}
     */
  public async login(
    authCredentialsRequestDto: AuthCredentialsRequestDto,
    ip: string,
    ua: string
  ): Promise<ResponseDto<LoginResponseDto>> {
    try{
      const { username, password } = authCredentialsRequestDto;
    const user: UserEntity = await this.userRepository.findUserByUsernameOrEmail(username);
    if (!user) throw new NotFoundCustomException('User not found');
    const passwordMatch = await user.validatePassword(password);
    if (!passwordMatch) {
      throw new BadRequestCustomException('Invalid credentials');
    }
    if (user.status == UserStatus.BLOCKED) {
      throw new BadRequestCustomException('User blocked');
    }
    const tokens = await this.tokenService.generateTokens(user);
    const userDto = await UsersMapper.toDtoPermRoles(user);
    const createdLoginLog = await this.loginLogService.create(user, ip, ua);
    await this.mailService.sendEMail({
      body: loginTemplate({
        username: user.username,
        email: user.email,
        deviceName: this.loginLogService.getDeviceOsName(ua),
        country: createdLoginLog.address,
      }),
      subject: 'You have logged in to our portal',
      to: user.email,
    });

    return this.responseService.makeResponse({
      message: 'Logged in successfully',
      payload: { user: userDto, tokens },
    });
  }catch(error){
    throw new CustomException(error);
    }
  }

  public async logout(): Promise<ResponseDto<null>> {
    try {
      const token = this.req.headers.authorization.split(' ')[1]
      if (!token) throw new NotFoundCustomException('Not Found');
      const foundTokenEntity = await this.tokenRepository.findOneBy({
        token,
        isActive: true,
      });
      if (!foundTokenEntity) throw new NotFoundCustomException('Not Found');
      const refreshTokenEntity = await this.tokenRepository.findOneBy({
        id: foundTokenEntity.parentId,
        isActive: true,
      });
      if (!refreshTokenEntity) throw new NotFoundCustomException('Not Found');
      await this.tokenService.deactivateRefreshToken(refreshTokenEntity.token);
      return this.responseService.makeResponse({
        message: 'Logged out successfully',
        payload: null,
      });
    } catch (error) {
      throw new CustomException(error);
    }
  }

  public async logoutAll(): Promise<ResponseDto<null>> {
    try {
      const user = this.req.user;
      await this.tokenService.deactivateAllRefreshTokens(user.id);
      return this.responseService.makeResponse({
        message: 'Logged out from all devices successfully',
        payload: null,
      });
    } catch (error) {
      throw new CustomException(error);
    }
  }


  async refreshAccessToken(
    refreshTokenDto: RefreshTokenRequestDto,
  ): Promise<ResponseDto<TokenResponseDto>> {
    try {
      return this.responseService.makeResponse({
        message: 'Token refreshed successfully',
        payload: await this.tokenService.refreshAccessToken(refreshTokenDto),
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new CustomException(error);
    }
  }

  decodeToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (error) {
      throw new CustomException(error);
    }
  }


}  