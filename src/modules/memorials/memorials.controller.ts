import { Controller, Delete, Patch, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MemorialsService } from './memorials.service';
import { ApiOkPaginatedResponse, PaginationParams, PaginationRequest } from 'src/helpers/pagination';
import { ApiOperation, ApiBearerAuth,  } from '@nestjs/swagger';
import { Post,  Body, Get, Param,  } from '@nestjs/common';
import { TOKEN_NAME } from 'src/constants';
import { ApiOkCustomResponse } from 'src/common/decorators';
import { NullDto } from 'src/common/dtos/null.dto';
import { ApiForbiddenCustomResponse } from 'src/common/decorators/api-forbidden-custom-response.decorator';
import { ApiUnauthorizedCustomResponse } from 'src/common/decorators/api-unauthorized-custom-response.decorator';
import { MemorialShortResponseDto } from './dto/memorial-short-response.dto';
import { ResponseDto } from 'src/common/dtos';
import { MemorialShortDto } from './dto/memorial-short.dto';
import { CreateMemorialDto } from './dto/create-memorial.dto';
import { MemorialResponseDto } from './dto/memorial-response.dto';
import { PaginationResponseDto } from 'src/helpers/pagination/pagination-response.dto';
import { MemorialsResponseDto } from './dto/memorials-response.dto';
import { MemorialMembersResponseDto } from './dto/memorial-member-response.dto';

@Controller({
    path: 'memorials',
    version: '1'
  })
  @ApiTags('Memorials')
export class MemorialsController {

    constructor(
        private readonly memorialsService: MemorialsService,
      ) { }

    @ApiOperation({ description: 'Get Memorials brief' })
    @ApiOkCustomResponse(MemorialShortResponseDto)
    @ApiForbiddenCustomResponse(NullDto)
    @ApiUnauthorizedCustomResponse(NullDto)
    @ApiBearerAuth(TOKEN_NAME)
    @Get('/short')
    public getMemorialsBrief(): Promise<ResponseDto<MemorialShortDto[]>> {
      return this.memorialsService.getMemorialsShort();
    }


    @ApiOperation({ description: 'Create Memorial' })
    @ApiOkCustomResponse(ResponseDto<string>)
    @ApiForbiddenCustomResponse(NullDto)
    @ApiUnauthorizedCustomResponse(NullDto)
    @ApiBearerAuth(TOKEN_NAME)
    @Post('/add')
    async addMemorial(
      @Body(ValidationPipe) dto: CreateMemorialDto
    ): Promise<ResponseDto<string>> {
      return this.memorialsService.createMemorial(dto);
    }
  
    @ApiOperation({ description: 'Create Memorial' })
    @ApiOkCustomResponse(MemorialResponseDto)
    @ApiForbiddenCustomResponse(NullDto)
    @ApiUnauthorizedCustomResponse(NullDto)
    @ApiBearerAuth(TOKEN_NAME)
    @Get('/:id')
    async getMemorial(
      @Param('id') id: string
    ): Promise<ResponseDto<MemorialResponseDto>> {
      return this.memorialsService.getMemorialById(id);
    }


    @ApiOperation({ description: 'Get available memorial sites' })
    @ApiOkPaginatedResponse(MemorialResponseDto)
    @ApiForbiddenCustomResponse(NullDto)
    @ApiUnauthorizedCustomResponse(NullDto)
    @ApiBearerAuth(TOKEN_NAME)
    @Get('/all')
    public getMemorials(
      @PaginationParams() pagination: PaginationRequest
    ): Promise<ResponseDto<PaginationResponseDto<MemorialsResponseDto>>> {
      return this.memorialsService.getMemorials(pagination);
    }
  
    @ApiOperation({ description: 'Get memorial members' })
    @ApiOkPaginatedResponse(MemorialMembersResponseDto)
    @ApiForbiddenCustomResponse(NullDto)
    @ApiUnauthorizedCustomResponse(NullDto)
    @ApiBearerAuth(TOKEN_NAME)
    @Get('/members/:id')
    public getMemorialMembers(
      @Param('id') id: string,
      @PaginationParams() pagination: PaginationRequest
    ): Promise<ResponseDto<PaginationResponseDto<MemorialMembersResponseDto>>> {
      return this.memorialsService.getMemorialMembers(id, pagination);
    }

    @ApiOperation({ description: 'Update Memorial by ID' })
    @ApiOkCustomResponse(ResponseDto)
    @ApiForbiddenCustomResponse(NullDto)
    @ApiUnauthorizedCustomResponse(NullDto)
    @ApiBearerAuth(TOKEN_NAME)
    @Patch('/:id/id')
    async updateMemorial(
      @Param('id') id: string,
      @Body(ValidationPipe) updateDto: import('./dto/update-memorial.dto').UpdateMemorialDto
    ): Promise<ResponseDto<string>> {
      return this.memorialsService.updateMemorial(id, updateDto);
    }

    @ApiOperation({ description: 'Delete Memorial by ID' })
    @ApiOkCustomResponse(ResponseDto)
    @ApiForbiddenCustomResponse(NullDto)
    @ApiUnauthorizedCustomResponse(NullDto)
    @ApiBearerAuth(TOKEN_NAME)
    @Delete('/:id/id')
    async deleteMemorial(
      @Param('id') id: string
    ): Promise<ResponseDto<string>> {
      return this.memorialsService.deleteMemorial(id);
    }
  // Add memorial-related endpoints here after moving from FamilyController
} 