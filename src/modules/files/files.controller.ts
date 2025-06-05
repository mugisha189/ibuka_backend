import {
  Controller,
  Post,
  UseGuards,
  UploadedFiles,
  UseInterceptors,
  Get,
  Param,
  Res,
  Delete,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiOkResponse, ApiConsumes, ApiBody, ApiParam } from '@nestjs/swagger';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { TOKEN_NAME } from 'src/constants';
import { CustomException } from 'src/common/http/exceptions/custom.exception';

@ApiTags('Files')
@Controller({
  path:"files",
  version:"1"
})
@ApiBearerAuth(TOKEN_NAME)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload one or more files', description: 'Upload one or more files. Returns an array of file IDs.' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  @ApiOkResponse({ description: 'Array of uploaded file IDs', type: ResponseDto })
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    const ids = await this.filesService.uploadFiles(files);
    return {
      success: true,
      message: 'Files uploaded successfully',
      payload: ids,
      path: '/files/upload',
      method: 'POST',
      timestamp: Date.now(),
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Serve file by ID', description: 'Redirects to the file URL for the given file ID.' })
  @ApiParam({ name: 'id', type: String })
  async serveFile(@Param('id') id: string) {
      return await this.filesService.getFileById(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete file by ID', description: 'Deletes a file by its ID.' })
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'File deleted successfully', type: ResponseDto })
  async deleteFile(@Param('id') id: string) {
    try {
      await this.filesService.deleteFileById(id);
      return {
        success: true,
        message: 'File deleted successfully',
        payload: null,
        path: `/files/${id}`,
        method: 'DELETE',
        timestamp: Date.now(),
      };
    } catch (error) {
      throw new CustomException(error);
    }
  }
} 