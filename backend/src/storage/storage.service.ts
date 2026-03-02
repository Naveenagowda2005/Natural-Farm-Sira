import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { v4 as uuidv4 } from 'uuid';

export enum StorageBucket {
  PRODUCT_IMAGES = 'product-images',
  BANNERS = 'banners',
  GALLERY = 'gallery',
  VIDEOS = 'videos',
  TESTIMONIAL_IMAGES = 'testimonial-images',
  TESTIMONIAL_VIDEOS = 'testimonial-videos',
}

export interface FileValidationOptions {
  allowedMimeTypes: string[];
  maxSizeBytes: number;
}

@Injectable()
export class StorageService {
  private readonly validationRules: Record<StorageBucket, FileValidationOptions> = {
    [StorageBucket.PRODUCT_IMAGES]: {
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      maxSizeBytes: 5 * 1024 * 1024, // 5MB
    },
    [StorageBucket.BANNERS]: {
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      maxSizeBytes: 5 * 1024 * 1024, // 5MB
    },
    [StorageBucket.GALLERY]: {
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      maxSizeBytes: 5 * 1024 * 1024, // 5MB
    },
    [StorageBucket.VIDEOS]: {
      allowedMimeTypes: ['video/mp4', 'video/webm'],
      maxSizeBytes: 50 * 1024 * 1024, // 50MB
    },
    [StorageBucket.TESTIMONIAL_IMAGES]: {
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      maxSizeBytes: 5 * 1024 * 1024, // 5MB
    },
    [StorageBucket.TESTIMONIAL_VIDEOS]: {
      allowedMimeTypes: ['video/mp4', 'video/webm'],
      maxSizeBytes: 50 * 1024 * 1024, // 50MB
    },
  };

  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * Validate file before upload
   */
  validateFile(
    file: Express.Multer.File,
    bucket: StorageBucket,
  ): void {
    const rules = this.validationRules[bucket];

    // Check file type
    if (!rules.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${rules.allowedMimeTypes.join(', ')}`,
      );
    }

    // Check file size
    if (file.size > rules.maxSizeBytes) {
      const maxSizeMB = rules.maxSizeBytes / (1024 * 1024);
      throw new BadRequestException(
        `File size exceeds maximum allowed size of ${maxSizeMB}MB`,
      );
    }
  }

  /**
   * Generate unique filename with original extension
   */
  generateUniqueFilename(originalFilename: string): string {
    const extension = originalFilename.split('.').pop();
    return `${uuidv4()}.${extension}`;
  }

  /**
   * Upload file to Supabase Storage
   */
  async uploadFile(
    file: Express.Multer.File,
    bucket: StorageBucket,
  ): Promise<string> {
    // Validate file
    this.validateFile(file, bucket);

    // Generate unique filename
    const filename = this.generateUniqueFilename(file.originalname);

    // Upload to Supabase Storage
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filename, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      throw new BadRequestException(`Failed to upload file: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  }

  /**
   * Delete file from Supabase Storage
   */
  async deleteFile(fileUrl: string, bucket: StorageBucket): Promise<void> {
    // Extract filename from URL
    const filename = this.extractFilenameFromUrl(fileUrl);

    if (!filename) {
      throw new BadRequestException('Invalid file URL');
    }

    const supabase = this.supabaseService.getClient();
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filename]);

    if (error) {
      throw new BadRequestException(`Failed to delete file: ${error.message}`);
    }
  }

  /**
   * Replace existing file with new one
   */
  async replaceFile(
    oldFileUrl: string,
    newFile: Express.Multer.File,
    bucket: StorageBucket,
  ): Promise<string> {
    // Upload new file first
    const newFileUrl = await this.uploadFile(newFile, bucket);

    // Delete old file (ignore errors if old file doesn't exist)
    try {
      await this.deleteFile(oldFileUrl, bucket);
    } catch (error) {
      // Log but don't throw - new file is already uploaded
      console.warn(`Failed to delete old file: ${error.message}`);
    }

    return newFileUrl;
  }

  /**
   * Extract filename from Supabase Storage URL
   */
  private extractFilenameFromUrl(url: string): string | null {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      return pathParts[pathParts.length - 1];
    } catch {
      return null;
    }
  }
}
