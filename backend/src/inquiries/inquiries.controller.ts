import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { InquiriesService } from './inquiries.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { UpdateInquiryReadDto } from './dto/update-inquiry-read.dto';
import { QueryInquiriesDto } from './dto/query-inquiries.dto';

@Controller('api/inquiries')
export class InquiriesController {
  constructor(private readonly inquiriesService: InquiriesService) {}

  // Public endpoint for creating inquiries (no auth required)
  @Post()
  async create(@Body() createInquiryDto: CreateInquiryDto) {
    return this.inquiriesService.create(createInquiryDto);
  }

  // Protected endpoints for admin access
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Query() queryDto: QueryInquiriesDto) {
    return this.inquiriesService.findAll(queryDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return this.inquiriesService.findOne(id);
  }

  @Patch(':id/read')
  @UseGuards(JwtAuthGuard)
  async updateReadStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateInquiryReadDto,
  ) {
    return this.inquiriesService.updateReadStatus(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    return this.inquiriesService.remove(id);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  async deleteAll() {
    return this.inquiriesService.deleteAll();
  }
}
