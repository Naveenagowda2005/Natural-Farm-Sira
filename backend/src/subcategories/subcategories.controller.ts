import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SubCategoriesService } from './subcategories.service';
import { CreateSubCategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubCategoryDto } from './dto/update-subcategory.dto';
import { ReorderSubCategoriesDto } from './dto/reorder-subcategories.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SubCategory } from './subcategory.entity';

@Controller('api/subcategories')
export class SubCategoriesController {
  constructor(private readonly subCategoriesService: SubCategoriesService) {}

  // Public endpoint for fetching subcategories (no auth required)
  @Get('public')
  async findPublic(): Promise<SubCategory[]> {
    return this.subCategoriesService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createSubCategoryDto: CreateSubCategoryDto): Promise<SubCategory> {
    return this.subCategoriesService.create(createSubCategoryDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<SubCategory[]> {
    return this.subCategoriesService.findAll();
  }

  @Put('reorder')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async reorder(@Body() reorderDto: ReorderSubCategoriesDto): Promise<void> {
    return this.subCategoriesService.reorder(reorderDto.subcategories);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string): Promise<SubCategory> {
    return this.subCategoriesService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateSubCategoryDto: UpdateSubCategoryDto,
  ): Promise<SubCategory> {
    return this.subCategoriesService.update(id, updateSubCategoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.subCategoriesService.remove(id);
  }
}
