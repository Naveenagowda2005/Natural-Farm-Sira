import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bannersApi, Banner } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Loader2, GripVertical } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableBannerProps {
  banner: Banner;
  index: number;
  onDelete: (banner: Banner) => void;
}

const SortableBanner = ({ banner, index, onDelete }: SortableBannerProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: banner.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card ref={setNodeRef} style={style} className={isDragging ? 'shadow-lg' : ''}>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <button
            className="cursor-grab active:cursor-grabbing touch-none"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-5 w-5 text-gray-400" />
          </button>
          <img
            src={banner.image_url}
            alt={`Banner ${banner.display_order}`}
            className="w-32 h-20 object-cover rounded"
          />
          <div className="flex-1">
            <p className="text-sm text-gray-600">Order: {index + 1}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(banner)}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const Banners = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingBanner, setDeletingBanner] = useState<Banner | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fetch banners
  const { data: banners = [], isLoading } = useQuery({
    queryKey: ['banners'],
    queryFn: bannersApi.getAll,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: bannersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
    },
    onError: (error: any) => {
      throw error;
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: bannersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      toast({
        title: 'Success',
        description: 'Banner deleted successfully',
      });
      setIsDeleteOpen(false);
      setDeletingBanner(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete banner',
        variant: 'destructive',
      });
    },
  });

  // Reorder mutation
  const reorderMutation = useMutation({
    mutationFn: bannersApi.reorder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      toast({
        title: 'Success',
        description: 'Banner order updated',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update banner order',
        variant: 'destructive',
      });
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validFiles: File[] = [];
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];

    for (const file of files) {
      // Validate file type
      if (!validTypes.includes(file.type)) {
        toast({
          title: 'Invalid file type',
          description: `${file.name}: Please select JPEG, PNG, or WebP images only`,
          variant: 'destructive',
        });
        continue;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: `${file.name}: Image must be less than 5MB`,
          variant: 'destructive',
        });
        continue;
      }

      validFiles.push(file);
    }

    setSelectedFiles(validFiles);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    
    setIsUploading(true);
    
    try {
      // Upload files one by one
      for (const file of selectedFiles) {
        await createMutation.mutateAsync(file);
      }
      
      toast({
        title: 'Success',
        description: `${selectedFiles.length} banner(s) uploaded successfully`,
      });
      
      setSelectedFiles([]);
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload some banners',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleOpenDelete = (banner: Banner) => {
    setDeletingBanner(banner);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingBanner) {
      deleteMutation.mutate(deletingBanner.id);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = banners.findIndex((banner) => banner.id === active.id);
      const newIndex = banners.findIndex((banner) => banner.id === over.id);

      const newOrder = arrayMove(banners, oldIndex, newIndex);
      const reorderedBanners = newOrder.map((banner, idx) => ({
        id: banner.id,
        display_order: idx + 1,
      }));

      reorderMutation.mutate(reorderedBanners);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Banners</h1>
          <p className="text-gray-600 mt-2">Manage homepage banners - Drag to reorder</p>
        </div>
      </div>

      {/* Upload Section */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Upload New Banners</h3>
              <p className="text-sm text-gray-600 mb-4">
                Accepted formats: JPEG, PNG, WebP. Max size: 5MB per image. You can select multiple images at once.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileSelect}
                  disabled={isUploading}
                  className="flex-1"
                  multiple
                />
                <Button
                  onClick={handleUpload}
                  disabled={selectedFiles.length === 0 || isUploading}
                >
                  {isUploading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  <Plus className="h-4 w-4 mr-2" />
                  Upload {selectedFiles.length > 0 && `(${selectedFiles.length})`}
                </Button>
              </div>
              {selectedFiles.length > 0 && (
                <div className="text-sm text-gray-600">
                  Selected: {selectedFiles.map(f => f.name).join(', ')}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Banners List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : banners.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">No banners found. Upload your first banner to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div>
          <p className="text-sm text-gray-600 mb-4">
            Drag banners to reorder them. The order will be saved automatically.
          </p>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={banners.map(banner => banner.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {banners.map((banner, index) => (
                  <SortableBanner
                    key={banner.id}
                    banner={banner}
                    index={index}
                    onDelete={handleOpenDelete}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this banner. This action cannot be undone.
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

export default Banners;
