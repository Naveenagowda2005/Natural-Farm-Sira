import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { StorageService, StorageBucket } from '../storage/storage.service';
import { GalleryImage } from './gallery-image.entity';
import { BulkDeleteDto } from './dto/bulk-delete.dto';
import { DatabaseErrorHandler } from '../common/utils/database-error.handler';

@Injectable()
export class GalleryService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly storageService: StorageService,
  ) {}

  async create(files: Express.Multer.File[]): Promise<GalleryImage[]> {
    const supabase = this.supabaseService.getClient();
    const uploadedImages: GalleryImage[] = [];

    for (const file of files) {
      try {
        // Upload file to storage
        const imageUrl = await this.storageService.uploadFile(
          file,
          StorageBucket.GALLERY,
        );

        // Insert gallery image record
        const { data, error } = await supabase
          .from('gallery_images')
          .insert({
            image_url: imageUrl,
          })
          .select()
          .single();

        if (error) {
          // Clean up uploaded file if database insert fails
          await this.storageService.deleteFile(imageUrl, StorageBucket.GALLERY);
          DatabaseErrorHandler.handleError(error, 'create gallery image');
        }

        uploadedImages.push(data);
      } catch (error) {
        // Continue with other files even if one fails
        console.error(`Failed to upload file ${file.originalname}:`, error);
      }
    }

    return uploadedImages;
  }

  async findAll(): Promise<GalleryImage[]> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      DatabaseErrorHandler.handleError(error, 'fetch gallery images');
    }

    return data || [];
  }

  async reorder(images: { id: string; display_order: number }[]): Promise<void> {
    const supabase = this.supabaseService.getClient();

    // Update each image's display_order
    for (const image of images) {
      const { error } = await supabase
        .from('gallery_images')
        .update({ display_order: image.display_order })
        .eq('id', image.id);

      if (error) {
        DatabaseErrorHandler.handleError(error, 'reorder gallery images');
      }
    }
  }

  async remove(id: string): Promise<void> {
    const supabase = this.supabaseService.getClient();

    // Get gallery image to retrieve image URL
    const { data: image, error: fetchError } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !image) {
      throw new NotFoundException(`Gallery image with ID ${id} not found`);
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from('gallery_images')
      .delete()
      .eq('id', id);

    if (deleteError) {
      DatabaseErrorHandler.handleError(deleteError, 'delete gallery image');
    }

    // Delete file from storage
    await this.storageService.deleteFile(image.image_url, StorageBucket.GALLERY);
  }

  async bulkDelete(bulkDeleteDto: BulkDeleteDto): Promise<void> {
    const supabase = this.supabaseService.getClient();

    // Get all images to retrieve URLs
    const { data: images, error: fetchError } = await supabase
      .from('gallery_images')
      .select('*')
      .in('id', bulkDeleteDto.ids);

    if (fetchError) {
      DatabaseErrorHandler.handleError(fetchError, 'fetch gallery images for bulk delete');
    }

    if (!images || images.length === 0) {
      throw new NotFoundException('No gallery images found with provided IDs');
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from('gallery_images')
      .delete()
      .in('id', bulkDeleteDto.ids);

    if (deleteError) {
      DatabaseErrorHandler.handleError(deleteError, 'bulk delete gallery images');
    }

    // Delete files from storage
    for (const image of images) {
      try {
        await this.storageService.deleteFile(image.image_url, StorageBucket.GALLERY);
      } catch (error) {
        // Log but continue with other deletions
        console.error(`Failed to delete file ${image.image_url}:`, error);
      }
    }
  }
}
