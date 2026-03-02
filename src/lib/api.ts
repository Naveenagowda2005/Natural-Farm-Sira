// API client for admin dashboard
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Helper to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('admin_token');
};

// Helper to create headers with auth
const getHeaders = (includeContentType = true): HeadersInit => {
  const headers: HeadersInit = {};
  const token = getAuthToken();
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }
  
  return headers;
};

// Generic API error handler
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new ApiError(response.status, errorData.message || 'An error occurred');
  }
  
  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }
  
  return response.json();
};

// ============= Categories API =============
export interface Category {
  id: string;
  name_en: string;
  name_kn: string;
  created_at: string;
  updated_at: string;
}

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await fetch(`${API_BASE_URL}/api/categories`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  // Public endpoint (no auth required)
  getAllPublic: async (): Promise<Category[]> => {
    const response = await fetch(`${API_BASE_URL}/api/categories/public`);
    return handleResponse(response);
  },

  getOne: async (id: string): Promise<Category> => {
    const response = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  create: async (data: { name_en: string; name_kn: string }): Promise<Category> => {
    const response = await fetch(`${API_BASE_URL}/api/categories`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  update: async (id: string, data: { name_en: string; name_kn: string }): Promise<Category> => {
    const response = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};

// ============= SubCategories API =============
export interface SubCategory {
  id: string;
  name_en: string;
  name_kn: string;
  category_id: string;
  created_at: string;
  updated_at: string;
}

export const subCategoriesApi = {
  getAll: async (): Promise<SubCategory[]> => {
    const response = await fetch(`${API_BASE_URL}/api/subcategories`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  // Public endpoint (no auth required)
  getAllPublic: async (): Promise<SubCategory[]> => {
    const response = await fetch(`${API_BASE_URL}/api/subcategories/public`);
    return handleResponse(response);
  },

  getOne: async (id: string): Promise<SubCategory> => {
    const response = await fetch(`${API_BASE_URL}/api/subcategories/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  create: async (data: { name_en: string; name_kn: string; category_id: string }): Promise<SubCategory> => {
    const response = await fetch(`${API_BASE_URL}/api/subcategories`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  update: async (id: string, data: { name_en: string; name_kn: string; category_id: string }): Promise<SubCategory> => {
    const response = await fetch(`${API_BASE_URL}/api/subcategories/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/subcategories/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};

// ============= Products API =============
export interface Product {
  id: string;
  name_en: string;
  name_kn: string;
  description?: string;
  price: number;
  mrp?: number;
  subcategory_id: string;
  is_visible: boolean;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export const productsApi = {
  getAll: async (filters?: { subcategory_id?: string; is_visible?: boolean }): Promise<Product[]> => {
    const params = new URLSearchParams();
    if (filters?.subcategory_id) params.append('subcategory_id', filters.subcategory_id);
    if (filters?.is_visible !== undefined) params.append('is_visible', String(filters.is_visible));
    
    const url = `${API_BASE_URL}/api/products${params.toString() ? `?${params}` : ''}`;
    const response = await fetch(url, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  // Public endpoint (no auth required, only visible products)
  getAllPublic: async (filters?: { subcategory_id?: string }): Promise<Product[]> => {
    const params = new URLSearchParams();
    if (filters?.subcategory_id) params.append('subcategory_id', filters.subcategory_id);
    
    const url = `${API_BASE_URL}/api/products/public${params.toString() ? `?${params}` : ''}`;
    const response = await fetch(url);
    return handleResponse(response);
  },

  getOne: async (id: string): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  create: async (data: {
    name_en: string;
    name_kn: string;
    description?: string;
    price: number;
    mrp?: number;
    subcategory_id: string;
  }): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/api/products`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  update: async (id: string, data: {
    name_en: string;
    name_kn: string;
    description?: string;
    price: number;
    mrp?: number;
    subcategory_id: string;
  }): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  updateVisibility: async (id: string, is_visible: boolean): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}/visibility`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ is_visible }),
    });
    return handleResponse(response);
  },

  uploadImage: async (id: string, file: File): Promise<Product> => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch(`${API_BASE_URL}/api/products/${id}/image`, {
      method: 'POST',
      headers: getHeaders(false), // Don't include Content-Type for FormData
      body: formData,
    });
    return handleResponse(response);
  },
};

// ============= Banners API =============
export interface Banner {
  id: string;
  image_url: string;
  display_order: number;
  created_at: string;
}

export const bannersApi = {
  getAll: async (): Promise<Banner[]> => {
    const response = await fetch(`${API_BASE_URL}/api/banners`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  create: async (file: File): Promise<Banner> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/api/banners`, {
      method: 'POST',
      headers: getHeaders(false),
      body: formData,
    });
    return handleResponse(response);
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/banners/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  reorder: async (banners: { id: string; display_order: number }[]): Promise<Banner[]> => {
    const response = await fetch(`${API_BASE_URL}/api/banners/reorder`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ banners }),
    });
    return handleResponse(response);
  },
};

// ============= Gallery API =============
export interface GalleryImage {
  id: string;
  image_url: string;
  created_at: string;
}

export const galleryApi = {
  getAll: async (): Promise<GalleryImage[]> => {
    const response = await fetch(`${API_BASE_URL}/api/gallery`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  create: async (files: File[]): Promise<GalleryImage[]> => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    
    const response = await fetch(`${API_BASE_URL}/api/gallery`, {
      method: 'POST',
      headers: getHeaders(false),
      body: formData,
    });
    return handleResponse(response);
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/gallery/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  bulkDelete: async (ids: string[]): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/gallery/bulk/delete`, {
      method: 'DELETE',
      headers: getHeaders(),
      body: JSON.stringify({ ids }),
    });
    return handleResponse(response);
  },
};

// ============= Videos API =============
export interface Video {
  id: string;
  title: string;
  video_url: string;
  video_type: 'url' | 'file';
  created_at: string;
}

export const videosApi = {
  getAll: async (): Promise<Video[]> => {
    const response = await fetch(`${API_BASE_URL}/api/videos`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  create: async (data: { title: string; video_url?: string; video_type: 'url' | 'file' }, file?: File): Promise<Video> => {
    if (file) {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('video_type', data.video_type);
      formData.append('file', file);
      
      const response = await fetch(`${API_BASE_URL}/api/videos`, {
        method: 'POST',
        headers: getHeaders(false),
        body: formData,
      });
      return handleResponse(response);
    } else {
      const response = await fetch(`${API_BASE_URL}/api/videos`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    }
  },

  update: async (id: string, data: { title: string }): Promise<Video> => {
    const response = await fetch(`${API_BASE_URL}/api/videos/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/videos/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};

// ============= Inquiries API =============
export interface Inquiry {
  id: string;
  customer_name: string;
  phone_number: string;
  message?: string;
  is_read: boolean;
  created_at: string;
}

export const inquiriesApi = {
  getAll: async (params?: { search?: string; page?: number; limit?: number }): Promise<{
    data: Inquiry[];
    total: number;
    page: number;
    limit: number;
  }> => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append('search', params.search);
    if (params?.page) searchParams.append('page', String(params.page));
    if (params?.limit) searchParams.append('limit', String(params.limit));
    
    const url = `${API_BASE_URL}/api/inquiries${searchParams.toString() ? `?${searchParams}` : ''}`;
    const response = await fetch(url, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  getOne: async (id: string): Promise<Inquiry> => {
    const response = await fetch(`${API_BASE_URL}/api/inquiries/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  updateReadStatus: async (id: string, is_read: boolean): Promise<Inquiry> => {
    const response = await fetch(`${API_BASE_URL}/api/inquiries/${id}/read`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ is_read }),
    });
    return handleResponse(response);
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/inquiries/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  deleteAll: async (): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/inquiries`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};

// ============= Testimonials API =============
export interface Testimonial {
  id: string;
  customer_name: string;
  message: string;
  media_url?: string;
  media_type?: 'image' | 'video';
  rating: number;
  is_visible: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export const testimonialsApi = {
  getAll: async (): Promise<Testimonial[]> => {
    const response = await fetch(`${API_BASE_URL}/api/testimonials`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  getAllPublic: async (): Promise<Testimonial[]> => {
    const response = await fetch(`${API_BASE_URL}/api/testimonials/public`);
    return handleResponse(response);
  },

  getOne: async (id: string): Promise<Testimonial> => {
    const response = await fetch(`${API_BASE_URL}/api/testimonials/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  create: async (data: {
    customer_name: string;
    message: string;
    media_type?: 'image' | 'video';
    rating?: number;
  }, file?: File): Promise<Testimonial> => {
    const formData = new FormData();
    formData.append('customer_name', data.customer_name);
    formData.append('message', data.message);
    if (data.media_type) formData.append('media_type', data.media_type);
    if (data.rating !== undefined) formData.append('rating', String(data.rating));
    if (file) formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/api/testimonials`, {
      method: 'POST',
      headers: getHeaders(false),
      body: formData,
    });
    return handleResponse(response);
  },

  update: async (id: string, data: {
    customer_name?: string;
    message?: string;
    rating?: number;
  }): Promise<Testimonial> => {
    const response = await fetch(`${API_BASE_URL}/api/testimonials/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  updateVisibility: async (id: string, is_visible: boolean): Promise<Testimonial> => {
    const response = await fetch(`${API_BASE_URL}/api/testimonials/${id}/visibility`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ is_visible }),
    });
    return handleResponse(response);
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/testimonials/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};
