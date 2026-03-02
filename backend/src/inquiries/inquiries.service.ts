import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Inquiry } from './inquiry.entity';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { UpdateInquiryReadDto } from './dto/update-inquiry-read.dto';
import { QueryInquiriesDto } from './dto/query-inquiries.dto';
import { DatabaseErrorHandler } from '../common/utils/database-error.handler';

export interface PaginatedInquiries {
  data: Inquiry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class InquiriesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(createInquiryDto: CreateInquiryDto): Promise<Inquiry> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('inquiries')
      .insert({
        customer_name: createInquiryDto.customer_name,
        phone_number: createInquiryDto.phone_number,
        message: createInquiryDto.message,
        is_read: false,
      })
      .select()
      .single();

    if (error) {
      DatabaseErrorHandler.handleError(error, 'create inquiry');
    }

    return data;
  }

  async findAll(queryDto: QueryInquiriesDto): Promise<PaginatedInquiries> {
    const supabase = this.supabaseService.getClient();
    const page = queryDto.page || 1;
    const limit = queryDto.limit || 50;
    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from('inquiries')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    // Add search filter if provided
    if (queryDto.search) {
      const searchTerm = `%${queryDto.search}%`;
      query = query.or(
        `customer_name.ilike.${searchTerm},phone_number.ilike.${searchTerm}`,
      );
    }

    // Add pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      DatabaseErrorHandler.handleError(error, 'fetch inquiries');
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    return {
      data: data || [],
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: string): Promise<Inquiry> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundException(`Inquiry with ID ${id} not found`);
    }

    return data;
  }

  async updateReadStatus(
    id: string,
    updateDto: UpdateInquiryReadDto,
  ): Promise<Inquiry> {
    const supabase = this.supabaseService.getClient();

    // Check if inquiry exists
    await this.findOne(id);

    // Update read status
    const { data, error } = await supabase
      .from('inquiries')
      .update({ is_read: updateDto.is_read })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      DatabaseErrorHandler.handleError(error, 'update inquiry read status');
    }

    return data;
  }

  async remove(id: string): Promise<void> {
    // Check if inquiry exists
    await this.findOne(id);

    const supabase = this.supabaseService.getClient();

    const { error } = await supabase
      .from('inquiries')
      .delete()
      .eq('id', id);

    if (error) {
      DatabaseErrorHandler.handleError(error, 'delete inquiry');
    }
  }

  async deleteAll(): Promise<{ message: string; count: number }> {
    const supabase = this.supabaseService.getClient();

    // First, get the count of inquiries to be deleted
    const { count: totalCount } = await supabase
      .from('inquiries')
      .select('*', { count: 'exact', head: true });

    // Delete all inquiries
    const { error } = await supabase
      .from('inquiries')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records

    if (error) {
      DatabaseErrorHandler.handleError(error, 'delete all inquiries');
    }

    return {
      message: 'All inquiries deleted successfully',
      count: totalCount || 0,
    };
  }
}
