import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { FileEntity } from './model/file.entity';
import { ResponseService } from 'src/shared/response/response.service';
import { NotFoundCustomException } from 'src/common/http/exceptions/not-found.exception';
import { CustomException } from 'src/common/http/exceptions/custom.exception';

@Injectable()
export class FilesService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    private readonly responseService: ResponseService,
  ) {}

  async uploadFiles(files: Express.Multer.File[]): Promise<string[]> {
    const uploaded = await this.cloudinaryService.uploadFiles(files);
    const ids: string[] = [];
    for (let i = 0; i < uploaded.length; i++) {
      const file = uploaded[i];
      const original = files[i];
      const entity = this.fileRepository.create({
        url: file.secure_url,
        filename: original.originalname,
        mimetype: original.mimetype,
        size: original.size,
        cloudinaryPublicId: file.public_id,
      });
      const saved = await this.fileRepository.save(entity);
      ids.push(saved.id);
    }
    return ids;
  }

  /**
   * Get file type category based on MIME type
   * @param mimetype File MIME type
   * @returns File type category
   */
  getFileType(mimetype: string): 'image' | 'video' | 'audio' | 'document' {
    if (mimetype.startsWith('image/')) {
      return 'image';
    } else if (mimetype.startsWith('video/')) {
      return 'video';
    } else if (mimetype.startsWith('audio/')) {
      return 'audio';
    } else {
      return 'document';
    }
  }

  /**
   * Check if file type is supported
   * @param mimetype File MIME type
   * @returns True if supported
   */
  isFileTypeSupported(mimetype: string): boolean {
    const supportedTypes = [
      // Images
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
      // Videos
      'video/mp4', 'video/mov', 'video/avi', 'video/webm', 'video/quicktime',
      // Audio
      'audio/mp3', 'audio/wav', 'audio/aac', 'audio/ogg', 'audio/mpeg', 'audio/mp4'
    ];
    return supportedTypes.includes(mimetype);
  }

  async getFileById(id: string, raw = false) {
    try {
      const file = await this.fileRepository.findOne({ where: { id } });
      if (!file) {
        throw new NotFoundCustomException('File not found');
      }
      if (raw) {
        return file;
      }
      return this.responseService.makeResponse({
        message: 'File retrieved successfully',
        payload: file,
      });
    } catch (error) {
      console.log(error)
      throw new CustomException(error);
    }
  }

  async deleteFileById(id: string): Promise<void> {
    try {
      const file = await this.fileRepository.findOne({ where: { id } });
      if (!file) throw new NotFoundCustomException('File not found');
      if (file.cloudinaryPublicId) {
        await this.cloudinaryService.deleteFile(file.cloudinaryPublicId);
      }
      await this.fileRepository.delete(id);
    } catch (error) {
      throw new CustomException(error);
    }
  }
} 