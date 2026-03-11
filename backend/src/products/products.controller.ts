import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateVisibilityDto } from './dto/update-visibility.dto';
import { ReorderProductsDto } from './dto/reorder-products.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Product } from './product.entity';

@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Public endpoint for fetching visible products (no auth required)
  @Get('public')
  async findPublic(
    @Query('subcategory_id') subcategoryId?: string,
  ): Promise<Product[]> {
    const filters: { subcategory_id?: string; is_visible: boolean } = {
      is_visible: true, // Only return visible products
    };

    if (subcategoryId) {
      filters.subcategory_id = subcategoryId;
    }

    return this.productsService.findAll(filters);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Query('subcategory_id') subcategoryId?: string,
    @Query('is_visible') isVisible?: string,
  ): Promise<Product[]> {
    const filters: { subcategory_id?: string; is_visible?: boolean } = {};

    if (subcategoryId) {
      filters.subcategory_id = subcategoryId;
    }

    if (isVisible !== undefined) {
      filters.is_visible = isVisible === 'true';
    }

    return this.productsService.findAll(filters);
  }

  @Put('reorder')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async reorder(@Body() reorderDto: ReorderProductsDto): Promise<void> {
    return this.productsService.reorder(reorderDto.products);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.productsService.remove(id);
  }

  @Patch(':id/visibility')
  @UseGuards(JwtAuthGuard)
  async updateVisibility(
    @Param('id') id: string,
    @Body() updateVisibilityDto: UpdateVisibilityDto,
  ): Promise<Product> {
    return this.productsService.updateVisibility(id, updateVisibilityDto.is_visible);
  }

  @Post(':id/image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Product> {
    return this.productsService.uploadImage(id, file);
  }
}
