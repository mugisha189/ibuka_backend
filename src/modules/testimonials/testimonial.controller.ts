import { ApiTags, } from '@nestjs/swagger';
import { Controller,  Post,  ValidationPipe } from '@nestjs/common';
import { TestimonialService } from './testimonial.service';
import { ApiOperation, ApiBearerAuth,  ApiExtraModels, ApiQuery } from '@nestjs/swagger';
import {  Body, Get, Param, Query, Patch, Delete } from '@nestjs/common';
import { TOKEN_NAME } from 'src/constants';
import { ApiOkCustomResponse } from 'src/common/decorators';
import { NullDto } from 'src/common/dtos/null.dto';
import { ApiForbiddenCustomResponse } from 'src/common/decorators/api-forbidden-custom-response.decorator';
import { ApiOkResponse } from '@nestjs/swagger';
import { CreateTestimonialRequestDto } from './dto/create-testimonial-req.dto';
import { CreateTestimonialsDto } from './dto/create-testimonials.dto';
import { CustomException } from 'src/common/http/exceptions/custom.exception';
import { ResponseDto } from 'src/common/dtos';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ApiUnauthorizedCustomResponse } from 'src/common/decorators/api-unauthorized-custom-response.decorator';
import { TestimonialsDto } from './dto/testimonials.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';

@Controller({
  path: 'testimonial',
  version: '1'
})
@ApiTags('Testimonial')
export class TestimonialController {

  constructor(
    private readonly testimonialService: TestimonialService,
    private readonly cloudinaryService: CloudinaryService
  ) { }


  @ApiOperation({ description: 'Get Testimonials by family' })
  @ApiOkResponse({ type: [TestimonialsDto] })
  @ApiForbiddenCustomResponse(NullDto)
  @ApiUnauthorizedCustomResponse(NullDto)
  @ApiBearerAuth(TOKEN_NAME)
  @Get('/family/:id')
  async getTestimonialsByFamily(
    @Param('id') id: string
  ): Promise<ResponseDto<TestimonialsDto[]>> {
    return this.testimonialService.getTestimonialsByFamily(id);
  }

  @ApiOperation({ description: 'Get Testimonials by member' })
  @ApiOkResponse({ type: [TestimonialsDto] })
  @ApiForbiddenCustomResponse(NullDto)
  @ApiUnauthorizedCustomResponse(NullDto)
  @ApiBearerAuth(TOKEN_NAME)
  @Get('/member/:id')
  async getTestimonialsByMember(
    @Param('id') id: string
  ): Promise<ResponseDto<TestimonialsDto[]>> {
    return this.testimonialService.getTestimonialsByMember(id);
  }

  @ApiExtraModels(CreateTestimonialRequestDto)
  @ApiOperation({ description: 'Create Testimonial' })
  @ApiOkCustomResponse(ResponseDto<string>)
  @ApiForbiddenCustomResponse(NullDto)
  @ApiUnauthorizedCustomResponse(NullDto)
  @Post("/")
  @ApiBearerAuth(TOKEN_NAME)
  async addTestimonial(
    @Body(ValidationPipe) dto: CreateTestimonialRequestDto,
  ): Promise<ResponseDto<string>> {
    try {
      return this.testimonialService.createTestimonial(dto);
    } catch (error) {
      console.log("the error stack is: " + error.stack);
      throw new CustomException(error);
    }
  }

  @ApiOperation({ description: 'Get all testimonials (paginated)' })
  @ApiOkResponse({ description: 'Paginated list of testimonials', schema: { example: { data: [], total: 0, page: 1, limit: 10 } } })
  @ApiForbiddenCustomResponse(NullDto)
  @ApiUnauthorizedCustomResponse(NullDto)
  @ApiBearerAuth(TOKEN_NAME)
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search keyword' })
  @Get('/all')
  async getAllTestimonials(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string
  ) {
    return this.testimonialService.findAll(Number(page), Number(limit), search);
  }

  /**
   * Get a single testimonial by ID
   * @param id Testimonial ID
   */
  @ApiOperation({ description: 'Get a single testimonial by ID' })
  @ApiOkResponse({ type: TestimonialsDto })
  @ApiForbiddenCustomResponse(NullDto)
  @ApiUnauthorizedCustomResponse(NullDto)
  @ApiBearerAuth(TOKEN_NAME)
  @Get('/:id/id')
  async getTestimonialById(
    @Param('id') id: string
  ) {
    return this.testimonialService.findOne(id);
  }

  /**
   * Update a testimonial by ID
   * @param id Testimonial ID
   * @param updateTestimonialDto Data to update
   */
  @ApiOperation({ description: 'Update a testimonial by ID' })
  @ApiOkCustomResponse(ResponseDto<string>)
  @ApiForbiddenCustomResponse(NullDto)
  @ApiUnauthorizedCustomResponse(NullDto)
  @ApiBearerAuth(TOKEN_NAME)
  @Patch('/:id/id')
  async updateTestimonial(
    @Param('id') id: string,
    @Body() updateTestimonialDto: UpdateTestimonialDto
  ) {
    return this.testimonialService.update(id, updateTestimonialDto);
  }

  /**
   * Delete a testimonial by ID
   * @param id Testimonial ID
   */
  @ApiOperation({ description: 'Delete a testimonial by ID' })
  @ApiOkCustomResponse(ResponseDto<string>)
  @ApiForbiddenCustomResponse(NullDto)
  @ApiUnauthorizedCustomResponse(NullDto)
  @ApiBearerAuth(TOKEN_NAME)
  @Delete('/:id/id')
  async deleteTestimonial(
    @Param('id') id: string
  ) {
    return this.testimonialService.remove(id);
  }

}