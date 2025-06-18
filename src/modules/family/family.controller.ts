import { ApiTags, getSchemaPath, ApiQuery } from '@nestjs/swagger';
import { Controller,  Put } from '@nestjs/common';
import { CreateFamilyRequestDto } from './dto/create-family-req.dto';
import { CreateMemberDto } from './dto/create-member.dto';
import { FamilyService } from './family.service';
import { ApiOkPaginatedResponse } from 'src/helpers/pagination';
import { ApiOperation, ApiBearerAuth, ApiBody, ApiExtraModels } from '@nestjs/swagger';
import { Post,  Body, Get, Param, Delete} from '@nestjs/common';
import { TOKEN_NAME } from 'src/constants';
import { ApiOkCustomResponse } from 'src/common/decorators';
import { NullDto } from 'src/common/dtos/null.dto';
import { ApiForbiddenCustomResponse } from 'src/common/decorators/api-forbidden-custom-response.decorator';
import { PaginationRequest, PaginationParams } from 'src/helpers/pagination';
import { FamilyDto } from './dto/family.dto';
import { ParseJsonPipe } from 'src/helpers/json-parser';
import { PaginationResponseDto } from 'src/helpers/pagination/pagination-response.dto';
import { CustomException } from 'src/common/http/exceptions/custom.exception';
import { ResponseDto } from 'src/common/dtos';
import { ApiUnauthorizedCustomResponse } from 'src/common/decorators/api-unauthorized-custom-response.decorator';
import { FamilyResponseDto } from './dto/family-response.dto';
import { FamilyProp } from './dto/family-prop.dto';
import { FamilyStructureDto } from './dto/family-structure.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';

@Controller({
  path: 'family',
  version: '1'
})
@ApiTags('Family')
export class FamilyController {

  constructor(
    private readonly familyService: FamilyService,
  ) { }


@ApiOperation({ description: 'Get paginated families list' })
@ApiOkPaginatedResponse(FamilyDto)
@ApiQuery({ name: 'search', type: 'string', required: false })
@ApiQuery({ name: 'deceased_families', type: 'string', required: false })
@ApiQuery({ name: 'survived_families', type: 'string', required: false })
@ApiQuery({ name: 'testimonial_families', type: 'string', required: false })
@ApiQuery({ name: 'sector', type: 'string', required: false })
@ApiQuery({ name: 'survivors', type: 'number', required: false })
@ApiQuery({ name: 'testimonials', type: 'number', required: false })
@ApiUnauthorizedCustomResponse(NullDto)
@ApiForbiddenCustomResponse(NullDto)
@ApiBearerAuth(TOKEN_NAME)
@Get('/families')
public getFamilies(
  @PaginationParams() pagination: PaginationRequest,
): Promise<ResponseDto<PaginationResponseDto<FamilyResponseDto>>> {
  return this.familyService.getFamilies(pagination);
}

  @ApiOperation({ description: 'Get family by id' })
  @ApiOkCustomResponse(FamilyProp)
  @ApiForbiddenCustomResponse(NullDto)
  @ApiUnauthorizedCustomResponse(NullDto)
  @ApiBearerAuth(TOKEN_NAME)
  @Get('/families/:id')
  public getFamily(
    @Param('id') id: string
  ): Promise<ResponseDto<FamilyProp>> {
    return this.familyService.getFamily(id);
  }



  @ApiExtraModels(CreateFamilyRequestDto, CreateMemberDto)
  @ApiOperation({ description: 'Create Family' })
  @ApiOkCustomResponse(ResponseDto<string>)
  @ApiForbiddenCustomResponse(NullDto)
  @ApiUnauthorizedCustomResponse(NullDto)
  @ApiBearerAuth(TOKEN_NAME)
  @Post('/family/add')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        family: {
          type: 'object',
          $ref: getSchemaPath(CreateFamilyRequestDto)
        },
        members: {
          type: 'array',
          items: { type: 'object', $ref: getSchemaPath(CreateMemberDto) }
        },
      }
    }
  })

  async addFamily(
    @Body('family', ParseJsonPipe) family: CreateFamilyRequestDto,
    @Body('members', ParseJsonPipe) members: CreateMemberDto[]
  ): Promise<ResponseDto<string>> {
    try {
      return this.familyService.createFamily({
        family_general:family,
        members
      });
    } catch (error) {
      console.log("the error stack is: " + error.stack);
      throw new CustomException(error);
    }
  }





  @ApiOperation({ description: 'Update Family by ID' })
  @ApiOkCustomResponse(ResponseDto<string>)
  @ApiForbiddenCustomResponse(NullDto)
  @ApiUnauthorizedCustomResponse(NullDto)
  @ApiBearerAuth(TOKEN_NAME)
  @Put('/family/:id')
  async updateFamily(
    @Param('id') id: string,
    @Body() updateDto: UpdateFamilyDto
  ): Promise<ResponseDto<string>> {
    try {
      return await this.familyService.updateFamily(id, updateDto);
    } catch (error) {
      throw new CustomException(error);
    }
  }







  @ApiOperation({ description: 'Delete Family' })
  @ApiOkCustomResponse(ResponseDto<string>)
  @ApiForbiddenCustomResponse(NullDto)
  @ApiUnauthorizedCustomResponse(NullDto)
  @ApiBearerAuth(TOKEN_NAME)
  @Delete('/families/remove/:id')
  public deleteFamily(
    id: string
  ): Promise<ResponseDto<string>> {
    return this.familyService.deleteFamily(id);
  }




  @ApiOperation({ description: 'Get Family Structure' })
  @ApiOkCustomResponse(FamilyStructureDto)
  @ApiForbiddenCustomResponse(NullDto)
  @ApiUnauthorizedCustomResponse(NullDto)
  @ApiBearerAuth(TOKEN_NAME)
  @Get('/family/structure/:id')
  async getFamilyStructure(
    @Param('id') id: string
  ): Promise<ResponseDto<FamilyStructureDto>> {
    return this.familyService.getFamilyStructure(id);
  }

}