import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GalleryService } from './gallery.service';
import { BulkDeleteDto } from './dto/bulk-delete.dto';

@Controller('api/gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files', 20)) // Allow up to 20 files
  async create(@UploadedFiles() files: Express.Multer.File[]) {
    return this.galleryService.create(files);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.galleryService.findAll();
  }

  @Get('public')
  async findAllPublic() {
    return this.galleryService.findAll();
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    await this.galleryService.remove(id);
    return { message: 'Gallery image deleted successfully' };
  }

  @Delete('bulk/delete')
  @UseGuards(JwtAuthGuard)
  async bulkDelete(@Body() bulkDeleteDto: BulkDeleteDto) {
    await this.galleryService.bulkDelete(bulkDeleteDto);
    return { message: 'Gallery images deleted successfully' };
  }
}
