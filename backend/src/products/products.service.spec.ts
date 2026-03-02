import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { SupabaseService } from '../supabase/supabase.service';
import { StorageService, StorageBucket } from '../storage/storage.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let supabaseService: SupabaseService;
  let storageService: StorageService;

  const mockSupabaseClient = {
    from: jest.fn(),
    storage: {
      from: jest.fn(),
    },
  };

  const mockSupabaseService = {
    getClient: jest.fn(() => mockSupabaseClient),
  };

  const mockStorageService = {
    uploadFile: jest.fn(),
    deleteFile: jest.fn(),
    replaceFile: jest.fn(),
    validateFile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: SupabaseService,
          useValue: mockSupabaseService,
        },
        {
          provide: StorageService,
          useValue: mockStorageService,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    supabaseService = module.get<SupabaseService>(SupabaseService);
    storageService = module.get<StorageService>(StorageService);

    // Reset mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadImage', () => {
    const mockFile: Express.Multer.File = {
      fieldname: 'image',
      originalname: 'test.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      size: 1024,
      buffer: Buffer.from('test'),
      stream: null,
      destination: '',
      filename: '',
      path: '',
    };

    const mockProduct = {
      id: '123',
      name_en: 'Test Product',
      name_kn: 'ಪರೀಕ್ಷಾ ಉತ್ಪನ್ನ',
      price: 100,
      mrp: 120,
      subcategory_id: 'sub123',
      is_visible: true,
      image_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    it('should throw BadRequestException when no file is provided', async () => {
      await expect(service.uploadImage('123', null)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.uploadImage('123', null)).rejects.toThrow(
        'No file provided',
      );
    });

    it('should throw NotFoundException when product does not exist', async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Not found' },
        }),
      };
      mockSupabaseClient.from.mockReturnValue(mockQuery);

      await expect(service.uploadImage('999', mockFile)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should upload new image when product has no existing image', async () => {
      const newImageUrl = 'https://storage.example.com/new-image.jpg';

      // Mock findOne
      const mockFindQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockProduct,
          error: null,
        }),
      };

      // Mock update
      const mockUpdateQuery = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { ...mockProduct, image_url: newImageUrl },
          error: null,
        }),
      };

      mockSupabaseClient.from
        .mockReturnValueOnce(mockFindQuery)
        .mockReturnValueOnce(mockUpdateQuery);

      // Mock uploadFile
      mockStorageService.uploadFile.mockResolvedValueOnce(newImageUrl);

      const result = await service.uploadImage('123', mockFile);

      expect(storageService.uploadFile).toHaveBeenCalledWith(
        mockFile,
        StorageBucket.PRODUCT_IMAGES,
      );
      expect(storageService.replaceFile).not.toHaveBeenCalled();
      expect(result.image_url).toBe(newImageUrl);
    });

    it('should replace existing image when product has an image', async () => {
      const oldImageUrl = 'https://storage.example.com/old-image.jpg';
      const newImageUrl = 'https://storage.example.com/new-image.jpg';
      const productWithImage = { ...mockProduct, image_url: oldImageUrl };

      // Mock findOne
      const mockFindQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: productWithImage,
          error: null,
        }),
      };

      // Mock update
      const mockUpdateQuery = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { ...productWithImage, image_url: newImageUrl },
          error: null,
        }),
      };

      mockSupabaseClient.from
        .mockReturnValueOnce(mockFindQuery)
        .mockReturnValueOnce(mockUpdateQuery);

      // Mock replaceFile
      mockStorageService.replaceFile.mockResolvedValueOnce(newImageUrl);

      const result = await service.uploadImage('123', mockFile);

      expect(storageService.replaceFile).toHaveBeenCalledWith(
        oldImageUrl,
        mockFile,
        StorageBucket.PRODUCT_IMAGES,
      );
      expect(storageService.uploadFile).not.toHaveBeenCalled();
      expect(result.image_url).toBe(newImageUrl);
    });

    it('should throw BadRequestException when database update fails', async () => {
      const newImageUrl = 'https://storage.example.com/new-image.jpg';

      // Mock findOne
      const mockFindQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockProduct,
          error: null,
        }),
      };

      // Mock update failure
      const mockUpdateQuery = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database error' },
        }),
      };

      mockSupabaseClient.from
        .mockReturnValueOnce(mockFindQuery)
        .mockReturnValueOnce(mockUpdateQuery);

      // Mock uploadFile
      mockStorageService.uploadFile.mockResolvedValueOnce(newImageUrl);

      await expect(service.uploadImage('123', mockFile)).rejects.toThrow(
        'Database operation failed',
      );
    });
  });

  describe('remove', () => {
    const mockProduct = {
      id: '123',
      name_en: 'Test Product',
      name_kn: 'ಪರೀಕ್ಷಾ ಉತ್ಪನ್ನ',
      price: 100,
      mrp: 120,
      subcategory_id: 'sub123',
      is_visible: true,
      image_url: 'https://storage.example.com/image.jpg',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    it('should delete product and associated image', async () => {
      // Mock findOne
      const mockFindQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockProduct,
          error: null,
        }),
      };

      // Mock delete
      const mockDeleteQuery = {
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          error: null,
        }),
      };

      mockSupabaseClient.from
        .mockReturnValueOnce(mockFindQuery)
        .mockReturnValueOnce(mockDeleteQuery);

      // Mock deleteFile
      mockStorageService.deleteFile.mockResolvedValueOnce(undefined);

      await service.remove('123');

      expect(storageService.deleteFile).toHaveBeenCalledWith(
        mockProduct.image_url,
        StorageBucket.PRODUCT_IMAGES,
      );
    });

    it('should delete product even if image deletion fails', async () => {
      // Mock findOne
      const mockFindQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockProduct,
          error: null,
        }),
      };

      // Mock delete
      const mockDeleteQuery = {
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          error: null,
        }),
      };

      mockSupabaseClient.from
        .mockReturnValueOnce(mockFindQuery)
        .mockReturnValueOnce(mockDeleteQuery);

      // Mock deleteFile failure
      mockStorageService.deleteFile.mockRejectedValueOnce(
        new Error('Storage error'),
      );

      // Should not throw
      await expect(service.remove('123')).resolves.not.toThrow();
    });

    it('should delete product without image', async () => {
      const productWithoutImage = { ...mockProduct, image_url: null };

      // Mock findOne
      const mockFindQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: productWithoutImage,
          error: null,
        }),
      };

      // Mock delete
      const mockDeleteQuery = {
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          error: null,
        }),
      };

      mockSupabaseClient.from
        .mockReturnValueOnce(mockFindQuery)
        .mockReturnValueOnce(mockDeleteQuery);

      await service.remove('123');

      expect(storageService.deleteFile).not.toHaveBeenCalled();
    });
  });
});
