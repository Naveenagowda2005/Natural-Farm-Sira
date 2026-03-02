import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { SubCategory } from './subcategory.entity';
import { CreateSubCategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubCategoryDto } from './dto/update-subcategory.dto';
import { DatabaseErrorHandler } from '../common/utils/database-error.handler';

@Injectable()
export class SubCategoriesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(createSubCategoryDto: CreateSubCategoryDto): Promise<SubCategory> {
    const supabase = this.supabaseService.getClient();

    // Validate parent category exists
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('id', createSubCategoryDto.category_id)
      .single();

    if (categoryError || !category) {
      throw new BadRequestException('Parent category does not exist');
    }

    const { data, error } = await supabase
      .from('subcategories')
      .insert([createSubCategoryDto])
      .select()
      .single();

    if (error) {
      DatabaseErrorHandler.handleError(error, 'create subcategory');
    }

    return data;
  }

  async findAll(): Promise<SubCategory[]> {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('subcategories')
      .select('*')
      .order('category_id', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      DatabaseErrorHandler.handleError(error, 'fetch subcategories');
    }

    return data || [];
  }

  async findOne(id: string): Promise<SubCategory> {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('subcategories')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundException(`SubCategory with ID ${id} not found`);
    }

    return data;
  }

  async update(id: string, updateSubCategoryDto: UpdateSubCategoryDto): Promise<SubCategory> {
    // First check if subcategory exists
    await this.findOne(id);

    const supabase = this.supabaseService.getClient();

    // If updating category_id, validate parent category exists
    if (updateSubCategoryDto.category_id) {
      const { data: category, error: categoryError } = await supabase
        .from('categories')
        .select('id')
        .eq('id', updateSubCategoryDto.category_id)
        .single();

      if (categoryError || !category) {
        throw new BadRequestException('Parent category does not exist');
      }
    }

    const { data, error } = await supabase
      .from('subcategories')
      .update(updateSubCategoryDto)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      DatabaseErrorHandler.handleError(error, 'update subcategory');
    }

    return data;
  }

  async remove(id: string): Promise<void> {
    // First check if subcategory exists
    await this.findOne(id);

    const supabase = this.supabaseService.getClient();

    // Check if subcategory has products
    const { data: products, error: productError } = await supabase
      .from('products')
      .select('id')
      .eq('subcategory_id', id)
      .limit(1);

    if (productError) {
      DatabaseErrorHandler.handleError(productError, 'check products');
    }

    if (products && products.length > 0) {
      throw new BadRequestException('Cannot delete subcategory with existing products');
    }

    // Delete the subcategory
    const { error } = await supabase
      .from('subcategories')
      .delete()
      .eq('id', id);

    if (error) {
      DatabaseErrorHandler.handleError(error, 'delete subcategory');
    }
  }
}
