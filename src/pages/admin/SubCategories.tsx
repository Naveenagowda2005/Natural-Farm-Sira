import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subCategoriesApi, categoriesApi, SubCategory } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Loader2, ChevronUp, ChevronDown } from 'lucide-react';

interface SubCategoryFormData {
  name_en: string;
  name_kn: string;
  category_id: string;
}

const SubCategories = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState<SubCategory | null>(null);
  const [deletingSubCategory, setDeletingSubCategory] = useState<SubCategory | null>(null);
  const [formData, setFormData] = useState<SubCategoryFormData>({
    name_en: '',
    name_kn: '',
    category_id: '',
  });
  const [formErrors, setFormErrors] = useState<Partial<SubCategoryFormData>>({});

  const { data: subCategories = [], isLoading } = useQuery({
    queryKey: ['subcategories'],
    queryFn: subCategoriesApi.getAll,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: subCategoriesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subcategories'] });
      toast({ title: 'Success', description: 'SubCategory created successfully' });
      handleCloseForm();
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message || 'Failed to create subcategory', variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: SubCategoryFormData }) => subCategoriesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subcategories'] });
      toast({ title: 'Success', description: 'SubCategory updated successfully' });
      handleCloseForm();
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message || 'Failed to update subcategory', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: subCategoriesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subcategories'] });
      toast({ title: 'Success', description: 'SubCategory deleted successfully' });
      setIsDeleteOpen(false);
      setDeletingSubCategory(null);
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message || 'Failed to delete subcategory', variant: 'destructive' });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: subCategoriesApi.reorder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subcategories'] });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message || 'Failed to reorder', variant: 'destructive' });
    },
  });

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newOrder = [...subCategories];
    [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
    reorderMutation.mutate(newOrder.map((item, idx) => ({ id: item.id, display_order: idx })));
  };

  const handleMoveDown = (index: number) => {
    if (index === subCategories.length - 1) return;
    const newOrder = [...subCategories];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    reorderMutation.mutate(newOrder.map((item, idx) => ({ id: item.id, display_order: idx })));
  };

  const validateForm = (): boolean => {
    const errors: Partial<SubCategoryFormData> = {};
    if (!formData.name_en.trim()) errors.name_en = 'English name is required';
    if (!formData.name_kn.trim()) errors.name_kn = 'Kannada name is required';
    if (!formData.category_id) errors.category_id = 'Category is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenAdd = () => {
    setEditingSubCategory(null);
    setFormData({ name_en: '', name_kn: '', category_id: '' });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const handleOpenEdit = (subCategory: SubCategory) => {
    setEditingSubCategory(subCategory);
    setFormData({ name_en: subCategory.name_en, name_kn: subCategory.name_kn, category_id: subCategory.category_id });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingSubCategory(null);
    setFormData({ name_en: '', name_kn: '', category_id: '' });
    setFormErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (editingSubCategory) {
      updateMutation.mutate({ id: editingSubCategory.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleOpenDelete = (subCategory: SubCategory) => {
    setDeletingSubCategory(subCategory);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingSubCategory) deleteMutation.mutate(deletingSubCategory.id);
  };

  const getCategoryName = (categoryId: string): string => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name_en : 'Unknown';
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">SubCategories</h1>
          <p className="text-gray-600 mt-2">Manage product subcategories</p>
        </div>
        <Button onClick={handleOpenAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add SubCategory
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : subCategories.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">No subcategories found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subCategories.map((subCategory, index) => (
            <Card key={subCategory.id}>
              <CardHeader>
                <CardTitle className="text-lg">{subCategory.name_en}</CardTitle>
                <CardDescription>
                  {subCategory.name_kn}
                  <br />
                  <span className="text-xs text-gray-500">Category: {getCategoryName(subCategory.category_id)}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 flex-wrap">
                  <Button variant="outline" size="sm" onClick={() => handleMoveUp(index)} disabled={index === 0 || reorderMutation.isPending}>
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleMoveDown(index)} disabled={index === subCategories.length - 1 || reorderMutation.isPending}>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleOpenEdit(subCategory)}>
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleOpenDelete(subCategory)}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSubCategory ? 'Edit SubCategory' : 'Add SubCategory'}</DialogTitle>
            <DialogDescription>Enter the subcategory details in both English and Kannada</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="category_id">Category</Label>
                <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })} disabled={isSubmitting}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>{category.name_en}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.category_id && <p className="text-sm text-red-500">{formErrors.category_id}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="name_en">English Name</Label>
                <Input id="name_en" value={formData.name_en} onChange={(e) => setFormData({ ...formData, name_en: e.target.value })} placeholder="Enter English name" disabled={isSubmitting} />
                {formErrors.name_en && <p className="text-sm text-red-500">{formErrors.name_en}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="name_kn">Kannada Name</Label>
                <Input id="name_kn" value={formData.name_kn} onChange={(e) => setFormData({ ...formData, name_kn: e.target.value })} placeholder="ಕನ್ನಡ ಹೆಸರು ನಮೂದಿಸಿ" disabled={isSubmitting} />
                {formErrors.name_kn && <p className="text-sm text-red-500">{formErrors.name_kn}</p>}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseForm} disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editingSubCategory ? 'Update' : 'Create'}
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
              This will permanently delete the subcategory "{deletingSubCategory?.name_en}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} disabled={deleteMutation.isPending} className="bg-red-600 hover:bg-red-700">
              {deleteMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SubCategories;
