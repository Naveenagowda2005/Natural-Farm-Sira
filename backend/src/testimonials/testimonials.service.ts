import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { StorageService, StorageBucket } from '../storage/storage.service';
import { Testimonial } from './testimonial.entity';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { UpdateVisibilityDto } from './dto/update-visibility.dto';
import { DatabaseErrorHandler } from '../common/utils/database-error.handler';

@Injectable()
export class TestimonialsService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly storageService: StorageService,
  ) {}

  async create(
    createDto: CreateTestimonialDto,
    file?: Express.Multer.File,
  ): Promise<Testimonial> {
    const supabase = this.supabaseService.getClient();
    let mediaUrl: string | undefined;

    // Upload media if provided
    if (file && createDto.media_type) {
      const bucket = createDto.media_type === 'image' 
        ? StorageBucket.TESTIMONIAL_IMAGES 
        : StorageBucket.TESTIMONIAL_VIDEOS;
      mediaUrl = await this.storageService.uploadFile(file, bucket);
    }

    const { data, error } = await supabase
      .from('testimonials')
      .insert({
        customer_name: createDto.customer_name,
        message: createDto.message,
        media_url: mediaUrl,
        media_type: createDto.media_type,
        rating: createDto.rating || 5,
        is_visible: true,
        display_order: 0,
      })
      .select()
      .single();

    if (error) {
      DatabaseErrorHandler.handleError(error, 'create testimonial');
    }

    return data;
  }

  async findAll(): Promise<Testimonial[]> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      DatabaseErrorHandler.handleError(error, 'fetch testimonials');
    }

    return data || [];
  }

  async findAllPublic(): Promise<Testimonial[]> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_visible', true)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      DatabaseErrorHandler.handleError(error, 'fetch public testimonials');
    }

    return data || [];
  }

  async findOne(id: string): Promise<Testimonial> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundException(`Testimonial with ID ${id} not found`);
    }

    return data;
  }

  async update(id: string, updateDto: UpdateTestimonialDto): Promise<Testimonial> {
    const supabase = this.supabaseService.getClient();

    // Check if exists
    await this.findOne(id);

    const { data, error } = await supabase
      .from('testimonials')
      .update({
        ...updateDto,
        updated_at: new Date(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      DatabaseErrorHandler.handleError(error, 'update testimonial');
    }

    return data;
  }

  async updateVisibility(id: string, updateDto: UpdateVisibilityDto): Promise<Testimonial> {
    const supabase = this.supabaseService.getClient();

    // Check if exists
    await this.findOne(id);

    const { data, error } = await supabase
      .from('testimonials')
      .update({
        is_visible: updateDto.is_visible,
        updated_at: new Date(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      DatabaseErrorHandler.handleError(error, 'update testimonial visibility');
    }

    return data;
  }

  async delete(id: string): Promise<void> {
    const supabase = this.supabaseService.getClient();

    // Get testimonial to delete media
    const testimonial = await this.findOne(id);

    // Delete media if exists
    if (testimonial.media_url && testimonial.media_type) {
      try {
        const bucket = testimonial.media_type === 'image' 
          ? StorageBucket.TESTIMONIAL_IMAGES 
          : StorageBucket.TESTIMONIAL_VIDEOS;
        await this.storageService.deleteFile(testimonial.media_url, bucket);
      } catch (error) {
        // Log but don't throw - testimonial will still be deleted
        console.warn(`Failed to delete testimonial media: ${error.message}`);
      }
    }

    // Delete testimonial
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);

    if (error) {
      DatabaseErrorHandler.handleError(error, 'delete testimonial');
    }
  }
}
