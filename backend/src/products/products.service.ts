import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { StorageService, StorageBucket } from '../storage/storage.service';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DatabaseErrorHandler } from '../common/utils/database-error.handler';

@Injectable()
export class ProductsService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly storageService: StorageService,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const supabase = this.supabaseService.getClient();

    // Verify subcategory exists
    const { data: subcategory, error: subcategoryError } = await supabase
      .from('subcategories')
      .select('id')
      .eq('id', createProductDto.subcategory_id)
      .single();

    if (subcategoryError || !subcategory) {
      throw new BadRequestException('Subcategory not found');
    }

    // Set default value for is_visible if not provided
    const productData = {
      ...createProductDto,
      is_visible: createProductDto.is_visible ?? true,
    };

    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single();

    if (error) {
      DatabaseErrorHandler.handleError(error, 'create product');
    }

    return data;
  }

  async findAll(filters?: { subcategory_id?: string; is_visible?: boolean }): Promise<Product[]> {
    const supabase = this.supabaseService.getClient();

    let query = supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.subcategory_id) {
      query = query.eq('subcategory_id', filters.subcategory_id);
    }

    if (filters?.is_visible !== undefined) {
      query = query.eq('is_visible', filters.is_visible);
    }

    const { data, error } = await query;

    if (error) {
      DatabaseErrorHandler.handleError(error, 'fetch products');
    }

    return data || [];
  }

  async findOne(id: string): Promise<Product> {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return data;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    // First check if product exists
    await this.findOne(id);

    const supabase = this.supabaseService.getClient();

    // If subcategory_id is being updated, verify it exists
    if (updateProductDto.subcategory_id) {
      const { data: subcategory, error: subcategoryError } = await supabase
        .from('subcategories')
        .select('id')
        .eq('id', updateProductDto.subcategory_id)
        .single();

      if (subcategoryError || !subcategory) {
        throw new BadRequestException('Subcategory not found');
      }
    }

    const { data, error } = await supabase
      .from('products')
      .update(updateProductDto)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      DatabaseErrorHandler.handleError(error, 'update product');
    }

    return data;
  }

  async remove(id: string): Promise<void> {
    // First check if product exists and get its data
    const product = await this.findOne(id);

    const supabase = this.supabaseService.getClient();

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      DatabaseErrorHandler.handleError(error, 'delete product');
    }

    // Delete associated image if exists
    if (product.image_url) {
      try {
        await this.storageService.deleteFile(
          product.image_url,
          StorageBucket.PRODUCT_IMAGES,
        );
      } catch (error) {
        // Log but don't throw - product is already deleted
        console.warn(`Failed to delete product image: ${error.message}`);
      }
    }
  }

  async updateVisibility(id: string, isVisible: boolean): Promise<Product> {
    // First check if product exists
    await this.findOne(id);

    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('products')
      .update({ is_visible: isVisible })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      DatabaseErrorHandler.handleError(error, 'update product visibility');
    }

    return data;
  }

  async uploadImage(id: string, file: Express.Multer.File): Promise<Product> {
    // Validate file is provided
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Get existing product
    const product = await this.findOne(id);

    // Upload new image (or replace existing one)
    let imageUrl: string;
    if (product.image_url) {
      // Replace existing image
      imageUrl = await this.storageService.replaceFile(
        product.image_url,
        file,
        StorageBucket.PRODUCT_IMAGES,
      );
    } else {
      // Upload new image
      imageUrl = await this.storageService.uploadFile(
        file,
        StorageBucket.PRODUCT_IMAGES,
      );
    }

    // Update product with new image URL
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('products')
      .update({ image_url: imageUrl })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      DatabaseErrorHandler.handleError(error, 'update product image');
    }

    return data;
  }
}
