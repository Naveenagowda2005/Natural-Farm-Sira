import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { InquiriesService } from './inquiries.service';
import { SupabaseService } from '../supabase/supabase.service';

describe('InquiriesService', () => {
  let service: InquiriesService;
  let supabaseService: SupabaseService;

  const mockSupabaseClient = {
    from: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    or: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    range: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    single: jest.fn(),
  };

  const mockSupabaseService = {
    getClient: jest.fn(() => mockSupabaseClient),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InquiriesService,
        {
          provide: SupabaseService,
          useValue: mockSupabaseService,
        },
      ],
    }).compile();

    service = module.get<InquiriesService>(InquiriesService);
    supabaseService = module.get<SupabaseService>(SupabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new inquiry', async () => {
      const createDto = {
        customer_name: 'John Doe',
        phone_number: '1234567890',
        message: 'Test inquiry',
      };

      const mockInquiry = {
        id: '123',
        ...createDto,
        is_read: false,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockSupabaseClient.single.mockResolvedValue({
        data: mockInquiry,
        error: null,
      });

      const result = await service.create(createDto);

      expect(result).toEqual(mockInquiry);
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('inquiries');
      expect(mockSupabaseClient.insert).toHaveBeenCalledWith({
        customer_name: createDto.customer_name,
        phone_number: createDto.phone_number,
        message: createDto.message,
        is_read: false,
      });
    });

    it('should throw error when database insert fails', async () => {
      const createDto = {
        customer_name: 'John Doe',
        phone_number: '1234567890',
      };

      const mockError = new Error('Database error');
      mockSupabaseClient.single.mockResolvedValue({
        data: null,
        error: mockError,
      });

      await expect(service.create(createDto)).rejects.toThrow('Database operation failed');
    });
  });

  describe('findAll', () => {
    it('should return paginated inquiries', async () => {
      const mockInquiries = [
        {
          id: '1',
          customer_name: 'John Doe',
          phone_number: '1234567890',
          is_read: false,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: '2',
          customer_name: 'Jane Smith',
          phone_number: '0987654321',
          is_read: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      mockSupabaseClient.range.mockResolvedValue({
        data: mockInquiries,
        error: null,
        count: 2,
      });

      const result = await service.findAll({ page: 1, limit: 50 });

      expect(result).toEqual({
        data: mockInquiries,
        total: 2,
        page: 1,
        limit: 50,
        totalPages: 1,
      });
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('inquiries');
      expect(mockSupabaseClient.order).toHaveBeenCalledWith('created_at', {
        ascending: false,
      });
    });

    it('should filter inquiries by search term', async () => {
      const mockInquiries = [
        {
          id: '1',
          customer_name: 'John Doe',
          phone_number: '1234567890',
          is_read: false,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      mockSupabaseClient.range.mockResolvedValue({
        data: mockInquiries,
        error: null,
        count: 1,
      });

      const result = await service.findAll({
        page: 1,
        limit: 50,
        search: 'John',
      });

      expect(result.data).toEqual(mockInquiries);
      expect(mockSupabaseClient.or).toHaveBeenCalledWith(
        'customer_name.ilike.%John%,phone_number.ilike.%John%',
      );
    });
  });

  describe('findOne', () => {
    it('should return a single inquiry', async () => {
      const mockInquiry = {
        id: '123',
        customer_name: 'John Doe',
        phone_number: '1234567890',
        is_read: false,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockSupabaseClient.single.mockResolvedValue({
        data: mockInquiry,
        error: null,
      });

      const result = await service.findOne('123');

      expect(result).toEqual(mockInquiry);
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('inquiries');
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('id', '123');
    });

    it('should throw NotFoundException when inquiry not found', async () => {
      mockSupabaseClient.single.mockResolvedValue({
        data: null,
        error: new Error('Not found'),
      });

      await expect(service.findOne('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateReadStatus', () => {
    it('should update inquiry read status', async () => {
      const mockInquiry = {
        id: '123',
        customer_name: 'John Doe',
        phone_number: '1234567890',
        is_read: false,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const updatedInquiry = { ...mockInquiry, is_read: true };

      // Mock findOne call
      mockSupabaseClient.single
        .mockResolvedValueOnce({
          data: mockInquiry,
          error: null,
        })
        // Mock update call
        .mockResolvedValueOnce({
          data: updatedInquiry,
          error: null,
        });

      const result = await service.updateReadStatus('123', { is_read: true });

      expect(result).toEqual(updatedInquiry);
      expect(mockSupabaseClient.update).toHaveBeenCalledWith({ is_read: true });
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('id', '123');
    });

    it('should throw NotFoundException when inquiry not found', async () => {
      mockSupabaseClient.single.mockResolvedValue({
        data: null,
        error: new Error('Not found'),
      });

      await expect(
        service.updateReadStatus('nonexistent', { is_read: true }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
