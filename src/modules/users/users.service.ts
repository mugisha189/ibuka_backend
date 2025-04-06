import { Injectable } from '@nestjs/common';
import { UserDto } from './dtos/user.dto';
import { ResponseDto } from 'src/common/dtos';
import { CustomException } from 'src/common/http/exceptions/custom.exception';
import { UserRepository } from './model/user.repository';
import { Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { UserRequest } from 'src/types/request';
import { ResponseService } from 'src/shared/response/response.service';
import { NotFoundCustomException } from 'src/common/http';
import { UsersMapper } from './users.mapper';
@Injectable({ scope: Scope.REQUEST })
export class UsersService {
    constructor(
        @Inject(REQUEST) private readonly req: UserRequest,
        private readonly userRepository: UserRepository,
        private readonly responseService: ResponseService
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
}