import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TestimonialsService } from './testimonials.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { UpdateVisibilityDto } from './dto/update-visibility.dto';

@Controller('api/testimonials')
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  // Public endpoint
  @Get('public')
  async findAllPublic() {
    return this.testimonialsService.findAllPublic();
  }

  // Protected endpoints
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.testimonialsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return this.testimonialsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createDto: CreateTestimonialDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    // Convert rating from string to number if it comes from FormData
    if (createDto.rating && typeof createDto.rating === 'string') {
      createDto.rating = parseInt(createDto.rating as any, 10);
    }
    return this.testimonialsService.create(createDto, file);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateDto: UpdateTestimonialDto) {
    return this.testimonialsService.update(id, updateDto);
  }

  @Patch(':id/visibility')
  @UseGuards(JwtAuthGuard)
  async updateVisibility(
    @Param('id') id: string,
    @Body() updateDto: UpdateVisibilityDto,
  ) {
    return this.testimonialsService.updateVisibility(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string) {
    return this.testimonialsService.delete(id);
  }
}
