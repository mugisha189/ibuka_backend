import { ApiTags, ApiQuery, ApiParam } from '@nestjs/swagger';
import { CreateMemberDto } from './dto/create-member.dto';
import { MemberService } from './member.service';
import { ApiOperation,  ApiBearerAuth } from '@nestjs/swagger';
import { Post,  Body, Get, Param, Delete, Query, Controller, Patch, ParseIntPipe } from '@nestjs/common';
import { TOKEN_NAME } from 'src/constants';
import { ApiOkCustomResponse } from 'src/common/decorators';
import { NullDto } from 'src/common/dtos/null.dto';
import { ApiForbiddenCustomResponse } from 'src/common/decorators/api-forbidden-custom-response.decorator';
import { ApiOkResponse } from '@nestjs/swagger';
import { CustomException } from 'src/common/http/exceptions/custom.exception';
import { ResponseDto } from 'src/common/dtos';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ApiUnauthorizedCustomResponse } from 'src/common/decorators/api-unauthorized-custom-response.decorator';
import { IbukaMemberDto } from './dto/ibuka-member.dto';
import { MembersEntity } from './models/members.entity';
import { UpdateMemberDto } from './dto/update-member.dto';
import { PaginationResponseDto } from 'src/helpers/pagination/pagination-response.dto';

@Controller({
  path: 'member',
  version: '1'
})
@ApiTags('Member')
export class MemberController {

  constructor(
    private readonly memberService: MemberService,
    private readonly cloudinaryService: CloudinaryService
  ) { }


  @ApiOperation({ description: 'Add a Member to a Member' })
  @ApiOkCustomResponse(ResponseDto<string>)
  @ApiForbiddenCustomResponse(NullDto)
  @ApiUnauthorizedCustomResponse(NullDto)
  @ApiBearerAuth(TOKEN_NAME)
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The ID of the member',
    required: true,
  })
  @Post('/add/:id')
  async addMember(
    @Param('id') id: string,
    @Body() memberDto: CreateMemberDto
  ): Promise<ResponseDto<string>> {
    try {
      return await this.memberService.addMemberToFamily(id,memberDto);
    } catch (error) {
      throw new CustomException(error);
    }
  }


  @ApiOperation({ description: 'Delete Member by ID' })
  @ApiOkCustomResponse(ResponseDto<string>)
  @ApiForbiddenCustomResponse(NullDto)
  @ApiUnauthorizedCustomResponse(NullDto)
  @ApiBearerAuth(TOKEN_NAME)
  @Delete('/:id/id')
  async deleteMember(
    @Param('id') id: string
  ): Promise<ResponseDto<string>> {
    try {
      return await this.memberService.deleteMember(id);
    } catch (error) {
      throw new CustomException(error);
    }
  }

  @ApiOperation({ description: 'Get Member by ID' })
  @ApiOkCustomResponse(ResponseDto<MembersEntity>)
  @ApiForbiddenCustomResponse(NullDto)
  @ApiUnauthorizedCustomResponse(NullDto)
  @ApiBearerAuth(TOKEN_NAME)
  @Get('/:id/id')
  async getMemberById(
    @Param('id') id: string
  ): Promise<ResponseDto<MembersEntity>> {
    try {
      return await this.memberService.getMemberById(id);
    } catch (error) {
      throw new CustomException(error);
    }
  }

  @ApiOperation({ description: 'Update Member by ID' })
  @ApiOkCustomResponse(ResponseDto<string>)
  @ApiForbiddenCustomResponse(NullDto)
  @ApiUnauthorizedCustomResponse(NullDto)
  @ApiBearerAuth(TOKEN_NAME)
  @Patch('/:id/id')
  async updateMember(
    @Param('id') id: string,
    @Body() updateDto: UpdateMemberDto
  ): Promise<ResponseDto<string>> {
    try {
      return await this.memberService.updateMember(id, updateDto);
    } catch (error) {
      throw new CustomException(error);
    }
  }

  @ApiOperation({ description: 'Get Members by Family ID' })
  @ApiOkCustomResponse(ResponseDto<MembersEntity[]>)
  @ApiForbiddenCustomResponse(NullDto)
  @ApiUnauthorizedCustomResponse(NullDto)
  @ApiBearerAuth(TOKEN_NAME)
  @Get('/family/:familyId')
  async getMembersByFamily(
    @Param('familyId') familyId: string
  ): Promise<ResponseDto<MembersEntity[]>> {
    try {
      return await this.memberService.getMembersByFamily(familyId);
    } catch (error) {
      throw new CustomException(error);
    }
  }

@ApiOperation({ description: 'Get Ibuka Members' })
@ApiOkResponse({ type: [IbukaMemberDto] })
@ApiForbiddenCustomResponse(NullDto)
@ApiUnauthorizedCustomResponse(NullDto)
@ApiBearerAuth(TOKEN_NAME)
@ApiQuery({ name: 'orphans', required: false, type: Boolean })
@ApiQuery({ name: 'widows', required: false, type: Boolean })
@ApiQuery({ name: 'widowers', required: false, type: Boolean })
@ApiQuery({ name: 'solitary', required: false, type: Boolean })
@ApiQuery({ name: 'search', required: false, type: String })
@ApiQuery({ name: 'sector', required: false, type: String })
@ApiQuery({ name: 'testimonials', required: false, type: Boolean })
@ApiQuery({ name: 'page', required: false, type: Number })
@ApiQuery({ name: 'limit', required: false, type: Number })
@Get('/ibuka/all')
public getIbukaMembers(
  @Query('orphans') orphans?: boolean,
  @Query('widows') widows?: boolean,
  @Query('widowers') widowers?: boolean,
  @Query('solitary') solitary?: boolean,
  @Query('search') search?: string,
  @Query('sector') sector?: string,
  @Query('testimonials') testimonials?: boolean,
  @Query('page', new ParseIntPipe({ optional: true })) page?: number,
  @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
): Promise<ResponseDto<PaginationResponseDto<IbukaMemberDto>>> {
  // Set default values if not provided
  const pageNumber = page || 1;
  const limitNumber = limit || 10;
  
  return this.memberService.getIbukaMembers({
    params: { orphans, widows, widowers, solitary, search, sector, testimonials },
    pagination: { page: pageNumber, limit: limitNumber },
  } as any);
}





}