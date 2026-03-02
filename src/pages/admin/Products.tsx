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
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Loader2, Package } from 'lucide-react';

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

const Products = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string>('');
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

  const { data: products = [], isLoading, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: () => productsApi.getAll(),
    staleTime: 0, // Always consider data stale
    refetchOnMount: true, // Refetch when component mounts
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


  const createMutation = useMutation({
    mutationFn: productsApi.create,
    onSuccess: async (newProduct) => {
      // Upload image if provided
      if (formData.image) {
        try {
          await productsApi.uploadImage(newProduct.id, formData.image);
        } catch (error) {
          console.error('Failed to upload image:', error);
        }
      }
      // Refetch products list
      await refetch();
      toast({ title: 'Success', description: 'Product created successfully' });
      handleCloseForm();
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message || 'Failed to create product', variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name_en: string; name_kn: string; description?: string; price: number; mrp?: number; subcategory_id: string } }) =>
      productsApi.update(id, data),
    onSuccess: async (updatedProduct) => {
      // Upload image if provided
      if (formData.image) {
        try {
          await productsApi.uploadImage(updatedProduct.id, formData.image);
        } catch (error) {
          console.error('Failed to upload image:', error);
        }
      }
      // Refetch products list
      await refetch();
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

  const toggleVisibilityMutation = useMutation({
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

  const validateForm = (): boolean => {
    const errors: Partial<ProductFormData> = {};
    if (!formData.name_en.trim()) errors.name_en = 'English name is required';
    if (!formData.name_kn.trim()) errors.name_kn = 'Kannada name is required';
    if (!formData.price.trim()) errors.price = 'Price is required';
    if (!formData.mrp.trim()) errors.mrp = 'MRP is required';
    if (!formData.category_id) errors.category_id = 'Category is required';
    if (!formData.subcategory_id) errors.subcategory_id = 'Subcategory is required';
    const price = parseFloat(formData.price);
    const mrp = parseFloat(formData.mrp);
    if (isNaN(price) || price <= 0) errors.price = 'Price must be a positive number';
    if (isNaN(mrp) || mrp <= 0) errors.mrp = 'MRP must be a positive number';
    if (price > mrp) errors.price = 'Price cannot be greater than MRP';
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => { setImagePreview(reader.result as string); };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    const submitData = {
      name_en: formData.name_en,
      name_kn: formData.name_kn,
      description: formData.description || undefined,
      price: parseFloat(formData.price),
      mrp: parseFloat(formData.mrp),
      subcategory_id: formData.subcategory_id,
    };
    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const handleOpenDelete = (product: Product) => {
    setDeletingProduct(product);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingProduct) deleteMutation.mutate(deletingProduct.id);
  };

  const handleToggleVisibility = (product: Product) => {
    toggleVisibilityMutation.mutate({ id: product.id, is_visible: !product.is_visible });
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;


  return (
    <div className="space-y-6">
      {/* Header with Animation */}
      <div className="flex items-center justify-between animate-fade-in-down">
        <div>
          <h1 className="text-4xl font-heading font-bold gradient-text mb-2">Products</h1>
          <p className="text-gray-600 flex items-center gap-2">
            <Package className="w-4 h-4" />
            Manage product inventory
          </p>
        </div>
        <Button 
          onClick={handleOpenAdd}
          className="bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:scale-105 transition-all duration-300 group"
        >
          <Plus className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:rotate-90" />
          Add Product
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <div className="absolute inset-0 h-12 w-12 animate-ping text-primary/20">
              <Loader2 className="h-12 w-12" />
            </div>
          </div>
        </div>
      ) : products.length === 0 ? (
        <Card className="glass-card hover-lift-glow animate-fade-in">
          <CardContent className="py-20 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center animate-bounce-in">
              <Package className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-heading font-bold text-gray-900 mb-2">No products yet</h3>
            <p className="text-gray-500 mb-6">Create your first product to get started.</p>
            <Button 
              onClick={handleOpenAdd}
              className="bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Product
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <Card 
              key={product.id} 
              className="glass-card hover-lift-glow group overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {product.image_url && (
                <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
                  <img 
                    src={product.image_url} 
                    alt={product.name_en} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Floating Badge */}
                  <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm shadow-lg animate-bounce-in">
                    <span className="text-sm font-bold text-primary">₹{product.price}</span>
                  </div>
                </div>
              )}
              <CardHeader className="relative">
                <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300">{product.name_en}</CardTitle>
                <p className="text-sm text-gray-600">{product.name_kn}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center text-sm p-3 rounded-lg bg-gradient-to-r from-primary/5 to-accent/5">
                    <span className="text-gray-600 font-medium">Price:</span>
                    <span className="font-bold text-primary text-lg">₹{product.price}</span>
                  </div>
                  {product.mrp && (
                    <div className="flex justify-between items-center text-sm p-3 rounded-lg bg-gray-50">
                      <span className="text-gray-600 font-medium">MRP:</span>
                      <span className="line-through text-gray-500">₹{product.mrp}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm p-3 rounded-lg bg-gradient-to-r from-gray-50 to-transparent">
                    <span className="text-gray-600 font-medium">Visible:</span>
                    <Switch 
                      checked={product.is_visible} 
                      onCheckedChange={() => handleToggleVisibility(product)}
                      className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-primary data-[state=checked]:to-accent"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleOpenEdit(product)}
                    className="flex-1 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 group/btn"
                  >
                    <Pencil className="h-4 w-4 mr-1 transition-transform duration-300 group-hover/btn:scale-110" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleOpenDelete(product)}
                    className="flex-1 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300 group/btn"
                  >
                    <Trash2 className="h-4 w-4 mr-1 transition-transform duration-300 group-hover/btn:scale-110" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}


      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto glass-card animate-scale-in">
          <DialogHeader>
            <DialogTitle className="text-2xl font-heading gradient-text flex items-center gap-2">
              {editingProduct ? (
                <>
                  <Pencil className="w-6 h-6" />
                  Edit Product
                </>
              ) : (
                <>
                  <Plus className="w-6 h-6" />
                  Add Product
                </>
              )}
            </DialogTitle>
            <DialogDescription className="text-base">
              Enter the product details in both English and Kannada
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-5 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 animate-fade-in-up stagger-1">
                  <Label htmlFor="name_en" className="font-semibold">English Name</Label>
                  <Input 
                    id="name_en" 
                    value={formData.name_en} 
                    onChange={(e) => setFormData({ ...formData, name_en: e.target.value })} 
                    placeholder="Enter English name" 
                    disabled={isSubmitting}
                    className="transition-all duration-300 focus:scale-105"
                  />
                  {formErrors.name_en && <p className="text-sm text-red-500 animate-fade-in">{formErrors.name_en}</p>}
                </div>
                <div className="space-y-2 animate-fade-in-up stagger-2">
                  <Label htmlFor="name_kn" className="font-semibold">Kannada Name</Label>
                  <Input 
                    id="name_kn" 
                    value={formData.name_kn} 
                    onChange={(e) => setFormData({ ...formData, name_kn: e.target.value })} 
                    placeholder="ಕನ್ನಡ ಹೆಸರು" 
                    disabled={isSubmitting}
                    className="transition-all duration-300 focus:scale-105"
                  />
                  {formErrors.name_kn && <p className="text-sm text-red-500 animate-fade-in">{formErrors.name_kn}</p>}
                </div>
              </div>
              <div className="space-y-2 animate-fade-in-up stagger-3">
                <Label htmlFor="description" className="font-semibold">Description / Information (Optional)</Label>
                <Textarea 
                  id="description" 
                  value={formData.description} 
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                  placeholder="Enter product description or additional information..." 
                  disabled={isSubmitting}
                  rows={3}
                  className="transition-all duration-300 focus:scale-105 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 animate-fade-in-up stagger-3">
                  <Label htmlFor="price" className="font-semibold">Price (₹)</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    step="0.01" 
                    value={formData.price} 
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })} 
                    placeholder="0.00" 
                    disabled={isSubmitting}
                    className="transition-all duration-300 focus:scale-105"
                  />
                  {formErrors.price && <p className="text-sm text-red-500 animate-fade-in">{formErrors.price}</p>}
                </div>
                <div className="space-y-2 animate-fade-in-up stagger-4">
                  <Label htmlFor="mrp" className="font-semibold">MRP (₹)</Label>
                  <Input 
                    id="mrp" 
                    type="number" 
                    step="0.01" 
                    value={formData.mrp} 
                    onChange={(e) => setFormData({ ...formData, mrp: e.target.value })} 
                    placeholder="0.00" 
                    disabled={isSubmitting}
                    className="transition-all duration-300 focus:scale-105"
                  />
                  {formErrors.mrp && <p className="text-sm text-red-500 animate-fade-in">{formErrors.mrp}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 animate-fade-in-up stagger-5">
                  <Label htmlFor="category_id" className="font-semibold">Category</Label>
                  <Select 
                    value={formData.category_id} 
                    onValueChange={(value) => { 
                      setFormData({ ...formData, category_id: value, subcategory_id: '' }); 
                      setSelectedCategoryId(value); 
                    }} 
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="transition-all duration-300 hover:scale-105">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>{category.name_en}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.category_id && <p className="text-sm text-red-500 animate-fade-in">{formErrors.category_id}</p>}
                </div>
                <div className="space-y-2 animate-fade-in-up stagger-6">
                  <Label htmlFor="subcategory_id" className="font-semibold">Subcategory</Label>
                  <Select 
                    value={formData.subcategory_id} 
                    onValueChange={(value) => setFormData({ ...formData, subcategory_id: value })} 
                    disabled={isSubmitting || !selectedCategoryId}
                  >
                    <SelectTrigger className="transition-all duration-300 hover:scale-105">
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {subcategories.map((subcategory) => (
                        <SelectItem key={subcategory.id} value={subcategory.id}>{subcategory.name_en}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.subcategory_id && <p className="text-sm text-red-500 animate-fade-in">{formErrors.subcategory_id}</p>}
                </div>
              </div>
              <div className="space-y-2 animate-fade-in-up">
                <Label htmlFor="image" className="font-semibold">Product Image</Label>
                <Input 
                  id="image" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  disabled={isSubmitting}
                  className="transition-all duration-300 hover:scale-105 cursor-pointer"
                />
                {imagePreview && (
                  <div className="mt-3 animate-scale-in">
                    <div className="relative group">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-48 object-cover rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-end p-4">
                        <p className="text-white text-sm font-semibold">Product Image Preview</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCloseForm} 
                disabled={isSubmitting}
                className="hover:scale-105 transition-all duration-300"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editingProduct ? 'Update Product' : 'Create Product'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className="glass-card animate-scale-in">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-heading flex items-center gap-2 text-red-600">
              <Trash2 className="w-6 h-6" />
              Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              This will permanently delete the product <span className="font-bold text-gray-900">"{deletingProduct?.name_en}"</span>. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel 
              disabled={deleteMutation.isPending}
              className="hover:scale-105 transition-all duration-300"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete} 
              disabled={deleteMutation.isPending} 
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 hover:scale-105 transition-all duration-300"
            >
              {deleteMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete Product
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Products;
