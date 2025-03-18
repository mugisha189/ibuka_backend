import { ApiTags, getSchemaPath } from '@nestjs/swagger';
import { Controller, UploadedFiles } from '@nestjs/common';
import { CreateFamilyDto } from './dto/create-family.dto';
import { CreateFamilyRequestDto } from './dto/create-family-req.dto';
import { CreateMemberDto } from './dto/create-member.dto';
import { FamilyService } from './family.service';
import { ApiOperation, ApiConsumes, ApiBearerAuth, ApiBody, ApiExtraModels } from '@nestjs/swagger';
import { Post, UseInterceptors, Body } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { TOKEN_NAME } from 'src/constants';
import { ApiOkCustomResponse } from 'src/common/decorators';
import { NullDto } from 'src/common/dtos/null.dto';
import { ApiForbiddenCustomResponse } from 'src/common/decorators/api-forbidden-custom-response.decorator';
import * as path from 'path';
import { ParseJsonPipe } from 'src/helpers/json-parser';
import { CustomException } from 'src/common/http/exceptions/custom.exception';
import { ResponseDto } from 'src/common/dtos';
import { BadRequestException } from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ApiUnauthorizedCustomResponse } from 'src/common/decorators/api-unauthorized-custom-response.decorator';

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
                ...family,
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

}