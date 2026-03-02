import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subCategoriesApi, categoriesApi, SubCategory, Category } from '@/lib/api';
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
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';

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

  // Fetch categories and subcategories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
  });

  const { data: subCategories = [], isLoading } = useQuery({
    queryKey: ['subcategories'],
    queryFn: subCategoriesApi.getAll,
  });

  // Group subcategories by category
  const groupedSubCategories = useMemo(() => {
    const groups: Record<string, { category: Category; subCategories: SubCategory[] }> = {};
    
    categories.forEach((category) => {
      groups[category.id] = {
        category,
        subCategories: subCategories.filter((sub) => sub.category_id === category.id),
      };
    });
    
    return groups;
  }, [categories, subCategories]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: subCategoriesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subcategories'] });
      toast({
        title: 'Success',
        description: 'Subcategory created successfully',
      });
      handleCloseForm();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create subcategory',
        variant: 'destructive',
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: SubCategoryFormData }) =>
      subCategoriesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subcategories'] });
      toast({
        title: 'Success',
        description: 'Subcategory updated successfully',
      });
      handleCloseForm();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update subcategory',
        variant: 'destructive',
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: subCategoriesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subcategories'] });
      toast({
        title: 'Success',
        description: 'Subcategory deleted successfully',
      });
      setIsDeleteOpen(false);
      setDeletingSubCategory(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete subcategory. It may contain products.',
        variant: 'destructive',
      });
    },
  });

  const validateForm = (): boolean => {
    const errors: Partial<SubCategoryFormData> = {};
    
    if (!formData.name_en.trim()) {
      errors.name_en = 'English name is required';
    }
    
    if (!formData.name_kn.trim()) {
      errors.name_kn = 'Kannada name is required';
    }
    
    if (!formData.category_id) {
      errors.category_id = 'Parent category is required';
    }
    
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
    setFormData({
      name_en: subCategory.name_en,
      name_kn: subCategory.name_kn,
      category_id: subCategory.category_id,
    });
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
    
    if (!validateForm()) {
      return;
    }

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
    if (deletingSubCategory) {
      deleteMutation.mutate(deletingSubCategory.id);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subcategories</h1>
          <p className="text-gray-600 mt-2">Manage product subcategories</p>
        </div>
        <Button onClick={handleOpenAdd} disabled={categories.length === 0}>
          <Plus className="h-4 w-4 mr-2" />
          Add Subcategory
        </Button>
      </div>

      {categories.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">Please create categories first before adding subcategories.</p>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : subCategories.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">No subcategories found. Create your first subcategory to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.values(groupedSubCategories).map(({ category, subCategories: subs }) => (
            subs.length > 0 && (
              <div key={category.id}>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  {category.name_en} ({category.name_kn})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {subs.map((subCategory) => (
                    <Card key={subCategory.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{subCategory.name_en}</CardTitle>
                        <CardDescription>{subCategory.name_kn}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenEdit(subCategory)}
                          >
                            <Pencil className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDelete(subCategory)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingSubCategory ? 'Edit Subcategory' : 'Add Subcategory'}
            </DialogTitle>
            <DialogDescription>
              Enter the subcategory details in both English and Kannada
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="category_id">Parent Category</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name_en} ({category.name_kn})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.category_id && (
                  <p className="text-sm text-red-500">{formErrors.category_id}</p>
                )}
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
                {formErrors.name_en && (
                  <p className="text-sm text-red-500">{formErrors.name_en}</p>
                )}
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
                {formErrors.name_kn && (
                  <p className="text-sm text-red-500">{formErrors.name_kn}</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseForm}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editingSubCategory ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the subcategory "{deletingSubCategory?.name_en}".
              This action cannot be undone. Subcategories with products cannot be deleted.
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

export default SubCategories;
