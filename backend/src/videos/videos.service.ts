import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { StorageService, StorageBucket } from '../storage/storage.service';
import { Video } from './video.entity';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { DatabaseErrorHandler } from '../common/utils/database-error.handler';

@Injectable()
export class VideosService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly storageService: StorageService,
  ) {}

  /**
   * Validate YouTube or Vimeo URL
   */
  private validateVideoUrl(url: string): boolean {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    const vimeoRegex = /^(https?:\/\/)?(www\.)?vimeo\.com\/.+$/;
    return youtubeRegex.test(url) || vimeoRegex.test(url);
  }

  async create(
    createVideoDto: CreateVideoDto,
    file?: Express.Multer.File,
  ): Promise<Video> {
    const supabase = this.supabaseService.getClient();
    let videoFileUrl: string | null = null;

    // Handle file upload
    if (createVideoDto.video_type === 'file') {
      if (!file) {
        throw new BadRequestException('Video file is required for file type');
      }

      videoFileUrl = await this.storageService.uploadFile(
        file,
        StorageBucket.VIDEOS,
      );
    }

    // Handle URL
    if (createVideoDto.video_type === 'url') {
      if (!createVideoDto.video_url) {
        throw new BadRequestException('Video URL is required for URL type');
      }

      if (!this.validateVideoUrl(createVideoDto.video_url)) {
        throw new BadRequestException(
          'Invalid video URL. Only YouTube and Vimeo URLs are supported',
        );
      }
    }

    // Insert video record
    const { data, error } = await supabase
      .from('videos')
      .insert({
        title: createVideoDto.title,
        video_url: createVideoDto.video_url || null,
        video_file_url: videoFileUrl,
        video_type: createVideoDto.video_type,
      })
      .select()
      .single();

    if (error) {
      // Clean up uploaded file if database insert fails
      if (videoFileUrl) {
        await this.storageService.deleteFile(videoFileUrl, StorageBucket.VIDEOS);
      }
      DatabaseErrorHandler.handleError(error, 'create video');
    }

    return data;
  }

  async findAll(): Promise<Video[]> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      DatabaseErrorHandler.handleError(error, 'fetch videos');
    }

    return data || [];
  }

  async update(id: string, updateVideoDto: UpdateVideoDto): Promise<Video> {
    const supabase = this.supabaseService.getClient();

    // Check if video exists
    const { data: existingVideo, error: fetchError } = await supabase
      .from('videos')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existingVideo) {
      throw new NotFoundException(`Video with ID ${id} not found`);
    }

    // Update video
    const { data, error } = await supabase
      .from('videos')
      .update({ title: updateVideoDto.title })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      DatabaseErrorHandler.handleError(error, 'update video');
    }

    return data;
  }

  async reorder(videos: { id: string; display_order: number }[]): Promise<void> {
    const supabase = this.supabaseService.getClient();

    // Update each video's display_order
    for (const video of videos) {
      const { error } = await supabase
        .from('videos')
        .update({ display_order: video.display_order })
        .eq('id', video.id);

      if (error) {
        DatabaseErrorHandler.handleError(error, 'reorder videos');
      }
    }
  }

  async remove(id: string): Promise<void> {
    const supabase = this.supabaseService.getClient();

    // Get video to retrieve file URL if it's a file type
    const { data: video, error: fetchError } = await supabase
      .from('videos')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !video) {
      throw new NotFoundException(`Video with ID ${id} not found`);
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from('videos')
      .delete()
      .eq('id', id);

    if (deleteError) {
      DatabaseErrorHandler.handleError(deleteError, 'delete video');
    }

    // Delete file from storage if it's a file type
    if (video.video_type === 'file' && video.video_file_url) {
      await this.storageService.deleteFile(video.video_file_url, StorageBucket.VIDEOS);
    }
  }
}
