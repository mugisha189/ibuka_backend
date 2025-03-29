import { ApiTags, getSchemaPath, ApiQuery } from '@nestjs/swagger';
import { Controller, UploadedFiles, ValidationPipe } from '@nestjs/common';
import { CreateFamilyDto } from './dto/create-family.dto';
import { CreateFamilyRequestDto } from './dto/create-family-req.dto';
import { CreateMemberDto } from './dto/create-member.dto';
import { FamilyService } from './family.service';
import { ApiOkPaginatedResponse } from 'src/helpers/pagination';
import { ApiOperation, ApiConsumes, ApiBearerAuth, ApiBody, ApiExtraModels } from '@nestjs/swagger';
import { Post, UseInterceptors, Body, Get, Param, Delete } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { TOKEN_NAME } from 'src/constants';
import { ApiOkCustomResponse } from 'src/common/decorators';
import { NullDto } from 'src/common/dtos/null.dto';
import { ApiForbiddenCustomResponse } from 'src/common/decorators/api-forbidden-custom-response.decorator';
import * as path from 'path';
import { PaginationRequest, PaginationParams } from 'src/helpers/pagination';
import { FamilyDto } from './dto/family.dto';
import { CreateTestimonialRequestDto } from './dto/create-testimonial-req.dto';
import { CreateTestimonialsDto } from './dto/create-testimonials.dto';
import { ParseJsonPipe } from 'src/helpers/json-parser';
import { PaginationResponseDto } from 'src/helpers/pagination/pagination-response.dto';
import { CustomException } from 'src/common/http/exceptions/custom.exception';
import { ResponseDto } from 'src/common/dtos';
import { BadRequestException } from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ApiUnauthorizedCustomResponse } from 'src/common/decorators/api-unauthorized-custom-response.decorator';
import { FamilyResponseDto } from './dto/family-response.dto';
import { FamilyProp } from './dto/family-prop.dto';
import { MemorialsResponseDto } from './dto/memorials-response.dto';
import { MemorialResponseDto } from './dto/memorial-response.dto';
import { CreateMemorialDto } from './dto/create-memorial.dto';
import { IbukaMemberDto } from './dto/ibuka-member.dto';
import { IbukaMembersResponseDto } from './dto/ibuka-members-response.dto';
import { MemorialMembersResponseDto } from './dto/memorial-member-response.dto';

@Controller({
    path: 'family',
    version: '1'
})
@ApiTags('Family')
export class FamilyController {

    constructor(
        private readonly familyService: FamilyService,
        private readonly cloudinaryService: CloudinaryService
    ){}

    private static async fileFilter(req, file, callback) {
        const allowedMimeTypes = [
          'image/jpeg', 'image/png', 'image/gif', 'application/pdf', 
          'image/webp', 'image/tiff', 'image/bmp', 'image/svg+xml',
          'application/octet-stream'
        ];
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.webp', '.tiff', '.bmp', '.svg'];
        const fileExtension = path.extname(file.originalname).toLowerCase();
        if (!allowedMimeTypes.includes(file.mimetype) || !allowedExtensions.includes(fileExtension)) {
          console.error(`Invalid file type: ${file.mimetype} | ${fileExtension}`);
          return callback(
            new BadRequestException(`Invalid file type: ${file.mimetype}. Allowed: ${allowedExtensions.join(', ')}`), 
            false
          );
        }
      
        callback(null, true);
      }

      private static async inputFilter(req, file, callback) {
        const allowedMimeTypes = [
            'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/tiff', 'image/bmp', 'image/svg+xml',
            'video/mp4', 'video/mpeg', 'video/x-msvideo', 'video/x-matroska', 'video/quicktime', 'video/webm',
            'video/x-flv', 'video/ogg',
            'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/aac', 'audio/flac', 'audio/x-ms-wma',
            'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'text/plain', 'application/rtf',
            'application/octet-stream'
        ];
    
        const allowedExtensions = [
            '.jpg', '.jpeg', '.png', '.gif', '.webp', '.tiff', '.bmp', '.svg',
            '.mp4', '.mpeg', '.mpg', '.avi', '.mkv', '.mov', '.webm', '.flv', '.ogg',
            '.mp3', '.wav', '.aac', '.flac', '.wma', '.ogg', '.m4a',
            '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.rtf',
            '.raw', '.dng', '.cr2'
        ];
        const fileExtension = path.extname(file.originalname).toLowerCase();
        if (!allowedMimeTypes.includes(file.mimetype) || !allowedExtensions.includes(fileExtension)) {
            console.error(`Invalid file type: ${file.mimetype} | ${fileExtension}`);
            return callback(
                new BadRequestException(`Invalid file type: ${file.mimetype}. Allowed: ${allowedExtensions.join(', ')}`), 
                false
            );
        }
        callback(null, true);
    }

    @ApiOperation({ description: 'Get paginated families list' })
    @ApiOkPaginatedResponse(FamilyDto)
    @ApiQuery({ name: 'search', type: 'string', required: false })
    @ApiQuery({ name: 'disseised_families', type: 'string', required: false })
    @ApiQuery({ name: 'survived_families', type: 'string', required: false })
    @ApiQuery({ name: 'testimonial_families', type: 'string', required: false })
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
      @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'profile_picture', maxCount: 20 }
        ], {
            fileFilter: FamilyController.fileFilter,
            limits: { fileSize: 5 * 1024 * 1024 }
        }
    )
      )
      @ApiConsumes('multipart/form-data')
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
                profile_picture: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary'
                    }
                }
            }
        }
      })
      async addFamily(
        @Body('family', ParseJsonPipe) family: CreateFamilyRequestDto,
        @Body('members', ParseJsonPipe) members: CreateMemberDto[],
        @UploadedFiles() files: {
            profile_picture: Express.Multer.File[]
        }
      ): Promise<ResponseDto<string>> {
        try{
            const fileMappings = [
                { field: 'profile_picture', folder: 'profile_images_folder', assignTo: 'uploaded_profile_pictures', isArray: true }
            ]
            const uploadedImages: Record<string, any> = {};
            await Promise.all(
                fileMappings.map(async({ field, folder, assignTo, isArray}) => {
                    const fileData = files?.[field];
                    if(!fileData) return;
                    if(isArray){
                        const results = await this.cloudinaryService.uploadFiles(fileData, folder);
                        uploadedImages[assignTo] = results.map((result) => result.secure_url);
                    }else{
                        const result = await this.cloudinaryService.uploadFileToCloudinary(fileData[0], folder);
                        uploadedImages[assignTo] = result.secure_url;
                    }
                })
            )
            const createFamilyDto: CreateFamilyDto = {
                family_general: family,
                members: members.map((member, index) => ({
                    ...member,
                    profile_picture: uploadedImages['uploaded_profile_pictures'] ? uploadedImages['uploaded_profile_pictures'][index] || null : null
                }))
            }
            return this.familyService.createFamily(createFamilyDto);
        }catch(error){
            console.log("the error stack is: " + error.stack);
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


      @ApiOperation({ description: 'Create Memorial' })
      @ApiOkCustomResponse(ResponseDto<string>)
      @ApiForbiddenCustomResponse(NullDto)
      @ApiUnauthorizedCustomResponse(NullDto)
      @ApiBearerAuth(TOKEN_NAME)
      @Post('/memorial/add')
      async addMemorial(
        @Body(ValidationPipe) dto: CreateMemorialDto
      ): Promise<ResponseDto<string>> {
        return this.familyService.createMemorial(dto);
      }

      @ApiExtraModels(CreateTestimonialRequestDto)
      @ApiOperation({ description: 'Create Testimonial' })
      @ApiOkCustomResponse(ResponseDto<string>)
      @ApiForbiddenCustomResponse(NullDto)
      @ApiUnauthorizedCustomResponse(NullDto)
      @ApiBearerAuth(TOKEN_NAME)
      @Post('/testimonial/add')
      @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'testimonial_files', maxCount: 20 }
        ], {
            fileFilter: FamilyController.inputFilter,
            limits: { fileSize: 5 * 1024 * 1024 }
        }
    )
      )
      @ApiConsumes('multipart/form-data')
      async addTestimonial(
        @Body(ValidationPipe) dto: CreateTestimonialRequestDto,
        @UploadedFiles() files: {
            testimonial_files: Express.Multer.File[]
        }
      ): Promise<ResponseDto<string>> {
        try{
            const fieldMappings = [
                { field: 'testimonial_files', folder: 'testimonials_folder', assignTo: 'uploaded_testimonials', isArray: true },
            ]
            const uploadedImages: Record<string, any> = {};
            await Promise.all(
                fieldMappings.map(async({ field, folder, assignTo }) => {
                    const fileData = files[field];
                    if(!fileData) return;
                    const results = await this.cloudinaryService.uploadFiles(fileData, folder);
                    uploadedImages[assignTo] = results.map((result) => result.secure_url);
                })
            )
            const createTestimonialDto: CreateTestimonialsDto = {
                ...dto,
                testimonial_files: files.testimonial_files ? uploadedImages['uploaded_testimonials'] : undefined
            }
            return this.familyService.createTestimonial(createTestimonialDto);
        }catch(error){
            console.log("the error stack is: " + error.stack);
            throw new CustomException(error);
        }
      }

      @ApiOperation({ description: 'Get available memorial sites' })
      @ApiOkPaginatedResponse(MemorialResponseDto)
      @ApiForbiddenCustomResponse(NullDto)
      @ApiUnauthorizedCustomResponse(NullDto)
      @ApiBearerAuth(TOKEN_NAME)
      @Get('/memorials/all')
      public getMemorials(
        @PaginationParams() pagination: PaginationRequest
      ): Promise<ResponseDto<PaginationResponseDto<MemorialsResponseDto>>> {
        return this.familyService.getMemorials(pagination);
      }

      @ApiOperation({ description: 'Get memorial members' })
      @ApiOkPaginatedResponse(MemorialMembersResponseDto)
      @ApiForbiddenCustomResponse(NullDto)
      @ApiUnauthorizedCustomResponse(NullDto)
      @ApiBearerAuth(TOKEN_NAME)
      @Get('/memorial/members/:id')
      public getMemorialMembers(
        @Param('id') id: string,
        @PaginationParams() pagination: PaginationRequest
      ): Promise<ResponseDto<PaginationResponseDto<MemorialMembersResponseDto>>> {
        return this.familyService.getMemorialMembers(id, pagination);
      }

      @ApiOperation({ description: 'Get Ibuka Members' })
      @ApiOkPaginatedResponse(IbukaMemberDto)
      @ApiForbiddenCustomResponse(NullDto)
      @ApiUnauthorizedCustomResponse(NullDto)
      @ApiBearerAuth(TOKEN_NAME)
      @Get('/members/ibuka/all')
      public getIbukaMembers(
        @PaginationParams() pagination: PaginationRequest
      ): Promise<ResponseDto<PaginationResponseDto<IbukaMembersResponseDto>>> {
        return this.familyService.getIbukaMembers(pagination);
      }
      

}