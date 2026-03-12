import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { VideosService } from './videos.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { ReorderVideosDto } from './dto/reorder-videos.dto';

@Controller('api/videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createVideoDto: CreateVideoDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.videosService.create(createVideoDto, file);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.videosService.findAll();
  }

  @Get('public')
  async findAllPublic() {
    return this.videosService.findAll();
  }

  @Put('reorder')
  @UseGuards(JwtAuthGuard)
  async reorder(@Body() reorderDto: ReorderVideosDto) {
    await this.videosService.reorder(reorderDto.videos);
    return { message: 'Videos reordered successfully' };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateVideoDto: UpdateVideoDto) {
    return this.videosService.update(id, updateVideoDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    await this.videosService.remove(id);
    return { message: 'Video deleted successfully' };
  }
}
