import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { DatabaseErrorHandler } from '../common/utils/database-error.handler';

@Injectable()
export class CategoriesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('categories')
      .insert([createCategoryDto])
      .select()
      .single();

    if (error) {
      DatabaseErrorHandler.handleError(error, 'create category');
    }

    return data;
  }

  async findAll(): Promise<Category[]> {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      DatabaseErrorHandler.handleError(error, 'fetch categories');
    }

    return data || [];
  }

  async findOne(id: string): Promise<Category> {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return data;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    // First check if category exists
    await this.findOne(id);

    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('categories')
      .update(updateCategoryDto)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      DatabaseErrorHandler.handleError(error, 'update category');
    }

    return data;
  }

  async remove(id: string): Promise<void> {
    // First check if category exists
    await this.findOne(id);

    const supabase = this.supabaseService.getClient();

    // Check if category has subcategories
    const { data: subcategories, error: subcategoryError } = await supabase
      .from('subcategories')
      .select('id')
      .eq('category_id', id)
      .limit(1);

    if (subcategoryError) {
      DatabaseErrorHandler.handleError(subcategoryError, 'check subcategories');
    }

    if (subcategories && subcategories.length > 0) {
      throw new BadRequestException('Cannot delete category with existing subcategories');
    }

    // Delete the category
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      DatabaseErrorHandler.handleError(error, 'delete category');
    }
  }

  async reorder(categories: { id: string; display_order: number }[]): Promise<void> {
    const supabase = this.supabaseService.getClient();

    for (const item of categories) {
      const { error } = await supabase
        .from('categories')
        .update({ display_order: item.display_order })
        .eq('id', item.id);

      if (error) {
        DatabaseErrorHandler.handleError(error, 'reorder categories');
      }
    }
  }
}
