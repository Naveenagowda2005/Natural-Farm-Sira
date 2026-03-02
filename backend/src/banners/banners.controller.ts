import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BannersService } from './banners.service';
import { ReorderBannersDto } from './dto/reorder-banners.dto';

@Controller('api/banners')
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async create(@UploadedFile() file: Express.Multer.File) {
    return this.bannersService.create(file);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.bannersService.findAll();
  }

  @Get('public')
  async findAllPublic() {
    return this.bannersService.findAll();
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    await this.bannersService.remove(id);
    return { message: 'Banner deleted successfully' };
  }

  @Put('reorder')
  @UseGuards(JwtAuthGuard)
  async reorder(@Body() reorderDto: ReorderBannersDto) {
    return this.bannersService.reorder(reorderDto);
  }
}
