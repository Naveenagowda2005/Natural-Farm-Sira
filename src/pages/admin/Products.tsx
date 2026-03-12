import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi, categoriesApi, subCategoriesApi, Product } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Loader2, Package, GripVertical, Eye, EyeOff } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ProductFormData {
  name_en: string;
  name_kn: string;
  description: string;
  price: string;
  mrp: string;
  category_id: string;
  subcategory_id: string;
  image?: File;
}

interface SortableProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onToggleVisibility: (product: Product) => void;
}

const SortableProductCard = ({ product, onEdit, onDelete, onToggleVisibility }: SortableProductCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card ref={setNodeRef} style={style} className={isDragging ? 'shadow-lg' : ''}>
      <CardHeader>
        <div className="flex items-start gap-2">
          <button
            className="cursor-grab active:cursor-grabbing mt-1 touch-none"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-5 w-5 text-gray-400" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{product.name_en}</CardTitle>
              {product.is_visible ? (
                <Eye className="h-4 w-4 text-green-600" />
              ) : (
                <EyeOff className="h-4 w-4 text-gray-400" />
              )}
            </div>
            <p className="text-sm text-gray-600">{product.name_kn}</p>
            <p className="text-sm font-semibold text-primary mt-1">₹{product.price}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => onToggleVisibility(product)}>
            {product.is_visible ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
            {product.is_visible ? 'Hide' : 'Show'}
          </Button>
          <Button variant="outline" size="sm" onClick={() => onEdit(product)}>
            <Pencil className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDelete(product)}>
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const Products = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string>('');
  
  // Filter states
  const [filterCategoryId, setFilterCategoryId] = useState<string>('all');
  const [filterSubCategoryId, setFilterSubCategoryId] = useState<string>('all');
  
  const [formData, setFormData] = useState<ProductFormData>({
    name_en: '',
    name_kn: '',
    description: '',
    price: '',
    mrp: '',
    category_id: '',
    subcategory_id: '',
  });
  const [formErrors, setFormErrors] = useState<Partial<ProductFormData>>({});

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => productsApi.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnMount: false,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
  });

  const { data: allSubcategories = [] } = useQuery({
    queryKey: ['subcategories'],
    queryFn: subCategoriesApi.getAll,
  });

  const subcategories = selectedCategoryId
    ? allSubcategories.filter(sub => sub.category_id === selectedCategoryId)
    : [];

  // Filter subcategories for the filter dropdown
  const filterSubcategories = filterCategoryId && filterCategoryId !== 'all'
    ? allSubcategories.filter(sub => sub.category_id === filterCategoryId)
    : [];

  // Filtered products based on selected filters
  const filteredProducts = products.filter(product => {
    if (filterCategoryId && filterCategoryId !== 'all') {
      const subcategory = allSubcategories.find(sub => sub.id === product.subcategory_id);
      if (!subcategory || subcategory.category_id !== filterCategoryId) {
        return false;
      }
    }
    if (filterSubCategoryId && filterSubCategoryId !== 'all' && product.subcategory_id !== filterSubCategoryId) {
      return false;
    }
    return true;
  });

  const createMutation = useMutation({
    mutationFn: productsApi.create,
    onSuccess: async (newProduct) => {
      if (formData.image) {
        try {
          await productsApi.uploadImage(newProduct.id, formData.image);
        } catch (error) {
          console.error('Failed to upload image:', error);
        }
      }
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: 'Success', description: 'Product created successfully' });
      handleCloseForm();
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message || 'Failed to create product', variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => productsApi.update(id, data),
    onSuccess: async (updatedProduct) => {
      if (formData.image) {
        try {
          await productsApi.uploadImage(updatedProduct.id, formData.image);
        } catch (error) {
          console.error('Failed to upload image:', error);
        }
      }
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: 'Success', description: 'Product updated successfully' });
      handleCloseForm();
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message || 'Failed to update product', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: productsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: 'Success', description: 'Product deleted successfully' });
      setIsDeleteOpen(false);
      setDeletingProduct(null);
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message || 'Failed to delete product', variant: 'destructive' });
    },
  });

  const visibilityMutation = useMutation({
    mutationFn: ({ id, is_visible }: { id: string; is_visible: boolean }) =>
      productsApi.updateVisibility(id, is_visible),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: 'Success', description: 'Product visibility updated' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message || 'Failed to update visibility', variant: 'destructive' });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: productsApi.reorder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'Success',
        description: 'Products order updated',
      });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message || 'Failed to reorder products', variant: 'destructive' });
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = filteredProducts.findIndex((prod) => prod.id === active.id);
      const newIndex = filteredProducts.findIndex((prod) => prod.id === over.id);

      const newOrder = arrayMove(filteredProducts, oldIndex, newIndex);
      const reorderedProducts = newOrder.map((prod, idx) => ({
        id: prod.id,
        display_order: idx,
      }));

      reorderMutation.mutate(reorderedProducts);
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<ProductFormData> = {};
    if (!formData.name_en.trim()) errors.name_en = 'English name is required';
    if (!formData.name_kn.trim()) errors.name_kn = 'Kannada name is required';
    if (!formData.price || parseFloat(formData.price) <= 0) errors.price = 'Valid price is required';
    if (!formData.subcategory_id) errors.subcategory_id = 'Subcategory is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({ name_en: '', name_kn: '', description: '', price: '', mrp: '', category_id: '', subcategory_id: '' });
    setSelectedCategoryId('');
    setImagePreview('');
    setFormErrors({});
    setIsFormOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    const subcategory = allSubcategories.find(sub => sub.id === product.subcategory_id);
    const categoryId = subcategory?.category_id || '';
    setEditingProduct(product);
    setFormData({
      name_en: product.name_en,
      name_kn: product.name_kn,
      description: product.description || '',
      price: product.price.toString(),
      mrp: product.mrp?.toString() || '',
      category_id: categoryId,
      subcategory_id: product.subcategory_id,
    });
    setSelectedCategoryId(categoryId);
    setImagePreview(product.image_url || '');
    setFormErrors({});
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
    setFormData({ name_en: '', name_kn: '', description: '', price: '', mrp: '', category_id: '', subcategory_id: '' });
    setSelectedCategoryId('');
    setImagePreview('');
    setFormErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const productData = {
      name_en: formData.name_en,
      name_kn: formData.name_kn,
      description: formData.description || undefined,
      price: parseFloat(formData.price),
      mrp: formData.mrp ? parseFloat(formData.mrp) : undefined,
      subcategory_id: formData.subcategory_id,
    };

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data: productData });
    } else {
      createMutation.mutate(productData);
    }
  };

  const handleOpenDelete = (product: Product) => {
    setDeletingProduct(product);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingProduct) {
      deleteMutation.mutate(deletingProduct.id);
    }
  };

  const handleToggleVisibility = (product: Product) => {
    visibilityMutation.mutate({ id: product.id, is_visible: !product.is_visible });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-2">Manage your products - Drag to reorder</p>
        </div>
        <Button onClick={handleOpenAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Filter Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Filter by Category</Label>
              <Select
                value={filterCategoryId}
                onValueChange={(value) => {
                  setFilterCategoryId(value);
                  setFilterSubCategoryId('all'); // Reset subcategory filter when category changes
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name_en}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Filter by SubCategory</Label>
              <Select
                value={filterSubCategoryId}
                onValueChange={setFilterSubCategoryId}
                disabled={!filterCategoryId || filterCategoryId === 'all'}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All SubCategories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All SubCategories</SelectItem>
                  {filterSubcategories.map((sub) => (
                    <SelectItem key={sub.id} value={sub.id}>{sub.name_en}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setFilterCategoryId('all');
                  setFilterSubCategoryId('all');
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              {products.length === 0 
                ? 'No products found. Create your first product to get started.'
                : 'No products match the selected filters.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filteredProducts.map(prod => prod.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <SortableProductCard
                  key={product.id}
                  product={product}
                  onEdit={handleOpenEdit}
                  onDelete={handleOpenDelete}
                  onToggleVisibility={handleToggleVisibility}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
            <DialogDescription>Enter the product details in both English and Kannada</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category_id">Category</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => {
                      setFormData({ ...formData, category_id: value, subcategory_id: '' });
                      setSelectedCategoryId(value);
                    }}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name_en}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subcategory_id">Subcategory</Label>
                  <Select
                    value={formData.subcategory_id}
                    onValueChange={(value) => setFormData({ ...formData, subcategory_id: value })}
                    disabled={isSubmitting || !selectedCategoryId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {subcategories.map((sub) => (
                        <SelectItem key={sub.id} value={sub.id}>{sub.name_en}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.subcategory_id && <p className="text-sm text-red-500">{formErrors.subcategory_id}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name_en">English Name</Label>
                <Input
                  id="name_en"
                  value={formData.name_en}
                  onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                  placeholder="Enter English name"
                  disabled={isSubmitting}
                />
                {formErrors.name_en && <p className="text-sm text-red-500">{formErrors.name_en}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="name_kn">Kannada Name</Label>
                <Input
                  id="name_kn"
                  value={formData.name_kn}
                  onChange={(e) => setFormData({ ...formData, name_kn: e.target.value })}
                  placeholder="ಕನ್ನಡ ಹೆಸರು ನಮೂದಿಸಿ"
                  disabled={isSubmitting}
                />
                {formErrors.name_kn && <p className="text-sm text-red-500">{formErrors.name_kn}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter product description"
                  disabled={isSubmitting}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                    disabled={isSubmitting}
                  />
                  {formErrors.price && <p className="text-sm text-red-500">{formErrors.price}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mrp">MRP (₹)</Label>
                  <Input
                    id="mrp"
                    type="number"
                    step="0.01"
                    value={formData.mrp}
                    onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                    placeholder="0.00"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Product Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isSubmitting}
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img src={imagePreview} alt="Preview" className="h-32 w-32 object-cover rounded" />
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseForm} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editingProduct ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the product "{deletingProduct?.name_en}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Products;
