import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AdminUsersService } from '../admin-users/admin-users.service';

describe('AuthService', () => {
  let service: AuthService;
  let adminUsersService: AdminUsersService;
  let jwtService: JwtService;

  const mockAdminUsersService = {
    findByUsername: jest.fn(),
    comparePassword: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: AdminUsersService,
          useValue: mockAdminUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    adminUsersService = module.get<AdminUsersService>(AdminUsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user without password_hash when credentials are valid', async () => {
      const mockUser = {
        id: '123',
        username: 'testuser',
        password_hash: 'hashed_password',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockAdminUsersService.findByUsername.mockResolvedValue(mockUser);
      mockAdminUsersService.comparePassword.mockResolvedValue(true);

      const result = await service.validateUser('testuser', 'password123');

      expect(result).toEqual({
        id: '123',
        username: 'testuser',
        created_at: mockUser.created_at,
        updated_at: mockUser.updated_at,
      });
      expect(mockAdminUsersService.findByUsername).toHaveBeenCalledWith('testuser');
      expect(mockAdminUsersService.comparePassword).toHaveBeenCalledWith('password123', 'hashed_password');
    });

    it('should return null when user is not found', async () => {
      mockAdminUsersService.findByUsername.mockResolvedValue(null);

      const result = await service.validateUser('nonexistent', 'password123');

      expect(result).toBeNull();
      expect(mockAdminUsersService.comparePassword).not.toHaveBeenCalled();
    });

    it('should return null when password is invalid', async () => {
      const mockUser = {
        id: '123',
        username: 'testuser',
        password_hash: 'hashed_password',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockAdminUsersService.findByUsername.mockResolvedValue(mockUser);
      mockAdminUsersService.comparePassword.mockResolvedValue(false);

      const result = await service.validateUser('testuser', 'wrongpassword');

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token and username', async () => {
      const mockUser = {
        id: '123',
        username: 'testuser',
      };

      const mockToken = 'mock.jwt.token';
      mockJwtService.sign.mockReturnValue(mockToken);

      const result = await service.login(mockUser);

      expect(result).toEqual({
        access_token: mockToken,
        username: 'testuser',
      });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: '123',
        username: 'testuser',
      });
    });
  });
});
