import { Injectable } from '@nestjs/common';
import { UserDto } from './dtos/user.dto';
import { ResponseDto } from 'src/common/dtos';
import { CustomException } from 'src/common/http/exceptions/custom.exception';
import { UserRepository } from './model/user.repository';
import { Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { UserRequest } from 'src/types/request';
import { ResponseService } from 'src/shared/response/response.service';
import { ConflictCustomException, NotFoundCustomException } from 'src/common/http';
import { UsersMapper } from './users.mapper';
import { CreateDistrictUserDto, CreateProvinceUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UpdateUserStatusDto } from './dtos/update-user-status.dto';
import { MailerService } from 'src/shared/mailer/mailer.service';
import { UserStatus } from './enums/user-status.enum';
import { ERoleType } from '../roles/enums/role.enum';
import { newUserEmailTemplate } from 'src/templates/auth/register-user.template';
import { TokensService } from '../tokens/token.service';
import { ConfigService } from '@nestjs/config';
import { ConfigKeyPaths } from 'src/config';
import { FilesService } from '../files/files.service';

@Injectable({ scope: Scope.REQUEST })
export class UsersService {
    constructor(
        @Inject(REQUEST) private readonly req: UserRequest,
        private readonly userRepository: UserRepository,
        private readonly responseService: ResponseService,
        private readonly mailerService: MailerService,
        private readonly tokenService: TokensService,
        private configService: ConfigService<ConfigKeyPaths>,
        private readonly filesService: FilesService,
    ){}
    async getProfile(): Promise<ResponseDto<UserDto>> {
        try{
            const user = await this.userRepository.findOne({
                where: { id: this.req.user.id },
                relations: ['roles', 'permissions']
            })
            if(!user){
                throw new NotFoundCustomException(`User not found`);
            }
            const userDto = await UsersMapper.toDtoPermRoles(user);
            return this.responseService.makeResponse({
                message: `User retrieved successfully`,
                payload: userDto
            })
        }catch(error){
            throw new CustomException(error);
        }
    }

    async getAllUsersPaginated(search: string, page: number, limit: number) {
        try {
            const { items, total } = await this.userRepository.findPaginatedUsers(search, page, limit);
            return this.responseService.makeResponse({
                message: 'Users retrieved successfully',
                payload: {
                    items,
                    totalItems: total,
                    itemCount: items.length,
                    itemsPerPage: limit,
                    totalPages: Math.ceil(total / limit),
                    currentPage: page
                }
            });
        } catch (error) {
            throw new CustomException(error);
        }
    }

    async createUserForDistrict(dto: CreateDistrictUserDto) {
        try {
            if ( this.req.user.role !== 'SUPER_ADMIN') {
                throw new CustomException('Only admin can create users for a district');
            }
            const existing = await this.userRepository.findOne({
                where: { email:dto.email },
              });
          
              if (existing) {
                throw new ConflictCustomException('A user with this email already exists.');
              }
            let profile_picture = null;
            if (dto.profile_picture) {
                try {
                    const fileRes = await this.filesService.getFileById(dto.profile_picture, true) as any;
                    if (fileRes && typeof fileRes === 'object' && 'url' in fileRes) {
                        profile_picture = fileRes.url;
                    }
                } catch (e) {
                    profile_picture = null;
                }
            }
            const user = this.userRepository.create({...dto, profile_picture, password:"Ibuka@123",role:ERoleType.DISTRICT_ADMIN});
            user.status = UserStatus.INACTIVE;
            const savedUser = await this.userRepository.save(user);
            const token = await this.tokenService.generateActivateAccountToken(savedUser);
            
            // Send email with setup instructions
            await this.mailerService.sendEMail({
                to: user.email,
                subject: 'Set up your account',
                body:newUserEmailTemplate({
                        name:user.username,
                        email: user.email,
                        setPasswordLink: `${this.configService.get('app.frontendDomain')}/set-password?token=${token.token}`,
                      })
            });
            return this.responseService.makeResponse({
                message: 'User created and email sent',
                payload: await UsersMapper.toDtoPermRoles(savedUser)
            });
        } catch (error) {
            throw new CustomException(error);
        }
    }

    async createUserForProvince(dto: CreateProvinceUserDto) {
        try {
            if ( this.req.user.role !== 'SUPER_ADMIN') {
                throw new CustomException('Only admin can create users for a provinc');
            }
            const existing = await this.userRepository.findOne({
                where: { email:dto.email },
              });
          
              if (existing) {
                throw new ConflictCustomException('A user with this email already exists.');
              }
            let profile_picture = null;
            if (dto.profile_picture) {
                try {
                    const fileRes = await this.filesService.getFileById(dto.profile_picture, true) as any;
                    if (fileRes && typeof fileRes === 'object' && 'url' in fileRes) {
                        profile_picture = fileRes.url;
                    }
                } catch (e) {
                    profile_picture = null;
                }
            }
            const user = this.userRepository.create({...dto, profile_picture, password:"Ibuka@123",role:ERoleType.PROVINCE_ADMIN});
            user.status = UserStatus.INACTIVE;
            const savedUser = await this.userRepository.save(user);
            const token = await this.tokenService.generateActivateAccountToken(savedUser);
            
            // Send email with setup instructions
            await this.mailerService.sendEMail({
                to: user.email,
                subject: 'Set up your account',
                body:newUserEmailTemplate({
                        name:user.username,
                        email: user.email,
                        setPasswordLink: `${this.configService.get('app.frontendDomain')}/set-password?token=${token.token}`,
                      })
            });
            return this.responseService.makeResponse({
                message: 'User created and email sent',
                payload: await UsersMapper.toDtoPermRoles(savedUser)
            });
        } catch (error) {
            throw new CustomException(error);
        }
    }

    async updateUserStatus(userId: string, dto: UpdateUserStatusDto) {
        try {
            let user = await this.userRepository.findOne({ where: { id: userId } });
            if (!user) throw new NotFoundCustomException('User not found');
            user.status = dto.status;
            user = await this.userRepository.save(user);
            return this.responseService.makeResponse({
                message: 'User status updated',
                payload: user
            });
        } catch (error) {
            throw new CustomException(error);
        }
    }

    async getUserById(userId: string) {
        try {
            const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['roles', 'permissions'] });
            if (!user) throw new NotFoundCustomException('User not found');
            const userDto = await UsersMapper.toDtoPermRoles(user);
            return this.responseService.makeResponse({
                message: 'User retrieved',
                payload: userDto
            });
        } catch (error) {
            throw new CustomException(error);
        }
    }

    async updateProfile(dto: UpdateUserDto) {
        try {
            const user = await this.userRepository.findOne({ where: { id: this.req.user.id } });
            if (!user) throw new NotFoundCustomException('User not found');
            // Only allow username, email, profile_picture
            if (dto.username) user.username = dto.username;
            if (dto.email) user.email = dto.email;
            if (dto.password) user.password = dto.password;
            if (dto.profile_picture) user.profile_picture = dto.profile_picture;
            await this.userRepository.save(user);
            return this.responseService.makeResponse({
                message: 'Profile updated',
                payload: null
            });
        } catch (error) {
            throw new CustomException(error);
        }
    }
}