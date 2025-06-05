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