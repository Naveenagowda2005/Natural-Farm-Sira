import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { StorageService, StorageBucket } from '../storage/storage.service';
import { Banner } from './banner.entity';
import { ReorderBannersDto } from './dto/reorder-banners.dto';
import { DatabaseErrorHandler } from '../common/utils/database-error.handler';

@Injectable()
export class BannersService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly storageService: StorageService,
  ) {}

  async create(file: Express.Multer.File): Promise<Banner> {
    // Upload file to storage
    const imageUrl = await this.storageService.uploadFile(
      file,
      StorageBucket.BANNERS,
    );

    // Get the next display order
    const supabase = this.supabaseService.getClient();
    const { data: maxOrderData } = await supabase
      .from('banners')
      .select('display_order')
      .order('display_order', { ascending: false })
      .limit(1)
      .single();

    const nextOrder = maxOrderData ? maxOrderData.display_order + 1 : 0;

    // Insert banner record
    const { data, error } = await supabase
      .from('banners')
      .insert({
        image_url: imageUrl,
        display_order: nextOrder,
      })
      .select()
      .single();

    if (error) {
      // Clean up uploaded file if database insert fails
      await this.storageService.deleteFile(imageUrl, StorageBucket.BANNERS);
      DatabaseErrorHandler.handleError(error, 'create banner');
    }

    return data;
  }

  async findAll(): Promise<Banner[]> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      DatabaseErrorHandler.handleError(error, 'fetch banners');
    }

    return data || [];
  }

  async remove(id: string): Promise<void> {
    const supabase = this.supabaseService.getClient();

    // Get banner to retrieve image URL
    const { data: banner, error: fetchError } = await supabase
      .from('banners')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !banner) {
      throw new NotFoundException(`Banner with ID ${id} not found`);
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from('banners')
      .delete()
      .eq('id', id);

    if (deleteError) {
      DatabaseErrorHandler.handleError(deleteError, 'delete banner');
    }

    // Delete file from storage
    await this.storageService.deleteFile(banner.image_url, StorageBucket.BANNERS);
  }

  async reorder(reorderDto: ReorderBannersDto): Promise<Banner[]> {
    const supabase = this.supabaseService.getClient();

    // Update each banner's display_order
    for (const item of reorderDto.banners) {
      const { error } = await supabase
        .from('banners')
        .update({ display_order: item.display_order })
        .eq('id', item.id);

      if (error) {
        DatabaseErrorHandler.handleError(error, 'reorder banners');
      }
    }

    // Return updated list
    return this.findAll();
  }
}
