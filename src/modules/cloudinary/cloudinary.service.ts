// cloudinary.service.ts
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary.response';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  /**
   * Upload multiple files to Cloudinary.
   * @param files Array of files to upload.
   * @param folder Optional folder path in Cloudinary.
   * @returns Promise that resolves to an array of Cloudinary responses.
   */
  async uploadFiles(
    files: Express.Multer.File[],
    folder: string = 'default_folder', // Reaplace with your desired default folder
  ): Promise<CloudinaryResponse[]> {
    // Map each file to an upload promise
    const uploadPromises = files.map((file) => this.uploadFileToCloudinary(file, folder));

    // Wait for all uploads to complete
    return Promise.all(uploadPromises);
  }

  /**
   * Upload a single file to Cloudinary.
   * @param file File to upload.
   * @param folder Folder path in Cloudinary.
   * @returns Promise that resolves to Cloudinary response.
   */
  async uploadFileToCloudinary(file: Express.Multer.File, folder: string): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      // Determine resource type based on file MIME type
      const resourceType = this.getResourceType(file.mimetype);
      
      // Get upload options based on file type
      const uploadOptions = this.getUploadOptions(file.mimetype, folder);

      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error: any, result: UploadApiResponse) => {
          if (error) {
            reject(error);
          } else {
            resolve(result as CloudinaryResponse);
          }
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  /**
   * Determine Cloudinary resource type based on MIME type
   * @param mimetype File MIME type
   * @returns Cloudinary resource type
   */
  private getResourceType(mimetype: string): string {
    if (mimetype.startsWith('video/')) {
      return 'video';
    } else if (mimetype.startsWith('audio/')) {
      return 'video'; // Cloudinary uses 'video' for audio files
    } else if (mimetype.startsWith('image/')) {
      return 'image';
    } else {
      return 'raw'; // For other file types
    }
  }

  /**
   * Get upload options based on file type
   * @param mimetype File MIME type
   * @param folder Cloudinary folder
   * @returns Upload options object
   */
  private getUploadOptions(mimetype: string, folder: string): any {
    const baseOptions = { folder };

    if (mimetype.startsWith('video/')) {
      return {
        ...baseOptions,
        resource_type: 'video',
        chunk_size: 6000000, // 6MB chunks for video uploads
        eager: [
          { width: 300, height: 300, crop: 'pad', audio_codec: 'none' },
          { width: 160, height: 100, crop: 'crop', gravity: 'south', audio_codec: 'none' }
        ],
        eager_async: true
      };
    } else if (mimetype.startsWith('audio/')) {
      return {
        ...baseOptions,
        resource_type: 'video', // Cloudinary uses 'video' for audio
        audio_codec: 'aac',
        audio_frequency: 44100
      };
    } else if (mimetype.startsWith('image/')) {
      return {
        ...baseOptions,
        resource_type: 'image',
        format: 'auto', // Let Cloudinary determine the best format
        quality: 'auto'
      };
    } else {
      return {
        ...baseOptions,
        resource_type: 'raw'
      };
    }
  }

  async deleteFile(publicId: string): Promise<any> {
    return cloudinary.uploader.destroy(publicId);
  }
}
