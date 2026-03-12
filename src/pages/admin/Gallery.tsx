import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { galleryApi, GalleryImage } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableImageProps {
  image: GalleryImage;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

const SortableImage = ({ image, isSelected, onToggle }: SortableImageProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card ref={setNodeRef} style={style} className={isDragging ? 'shadow-lg' : 'relative group'}>
      <CardContent className="p-2">
        <div className="absolute top-4 left-4 z-10">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onToggle(image.id)}
            className="bg-white"
          />
        </div>
        <button
          className="absolute top-4 right-4 z-10 cursor-grab active:cursor-grabbing touch-none bg-white rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5 text-gray-600" />
        </button>
        <img
          src={image.image_url}
          alt="Gallery"
          className="w-full h-48 object-cover rounded cursor-pointer"
          onClick={() => onToggle(image.id)}
        />
        <div className="mt-2">
          <p className="text-xs text-gray-500 truncate">
            {new Date(image.created_at).toLocaleDateString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const Gallery = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [isUploading, setIsUploading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fetch gallery images
  const { data: images = [], isLoading } = useQuery({
    queryKey: ['gallery'],
    queryFn: galleryApi.getAll,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: galleryApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      toast({
        title: 'Success',
        description: `${selectedFiles.length} image(s) uploaded successfully`,
      });
      setSelectedFiles([]);
      setIsUploading(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload images',
        variant: 'destructive',
      });
      setIsUploading(false);
    },
  });

  // Bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: galleryApi.bulkDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      toast({
        title: 'Success',
        description: `${selectedImages.size} image(s) deleted successfully`,
      });
      setIsDeleteOpen(false);
      setSelectedImages(new Set());
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete images',
        variant: 'destructive',
      });
    },
  });

  // Reorder mutation
  const reorderMutation = useMutation({
    mutationFn: galleryApi.reorder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      toast({
        title: 'Success',
        description: 'Gallery order updated',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update gallery order',
        variant: 'destructive',
      });
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate each file
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    const validFiles: File[] = [];
    const errors: string[] = [];

    files.forEach((file) => {
      if (!validTypes.includes(file.type)) {
        errors.push(`${file.name}: Invalid file type`);
      } else if (file.size > maxSize) {
        errors.push(`${file.name}: File too large (max 5MB)`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      toast({
        title: 'Some files were rejected',
        description: errors.join(', '),
        variant: 'destructive',
      });
    }

    if (validFiles.length > 0) {
      setSelectedFiles(validFiles);
    }
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) return;
    
    setIsUploading(true);
    createMutation.mutate(selectedFiles);
  };

  const handleToggleImage = (imageId: string) => {
    const newSelected = new Set(selectedImages);
    if (newSelected.has(imageId)) {
      newSelected.delete(imageId);
    } else {
      newSelected.add(imageId);
    }
    setSelectedImages(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedImages.size === images.length) {
      setSelectedImages(new Set());
    } else {
      setSelectedImages(new Set(images.map((img) => img.id)));
    }
  };

  const handleOpenDelete = () => {
    if (selectedImages.size === 0) {
      toast({
        title: 'No images selected',
        description: 'Please select at least one image to delete',
        variant: 'destructive',
      });
      return;
    }
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    bulkDeleteMutation.mutate(Array.from(selectedImages));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((image) => image.id === active.id);
      const newIndex = images.findIndex((image) => image.id === over.id);

      const newOrder = arrayMove(images, oldIndex, newIndex);
      const reorderedImages = newOrder.map((image, idx) => ({
        id: image.id,
        display_order: idx,
      }));

      reorderMutation.mutate(reorderedImages);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gallery</h1>
          <p className="text-gray-600 mt-2">Manage gallery images - Drag to reorder</p>
        </div>
        {selectedImages.size > 0 && (
          <Button variant="destructive" onClick={handleOpenDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Selected ({selectedImages.size})
          </Button>
        )}
      </div>

      {/* Upload Section */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Upload Images</h3>
              <p className="text-sm text-gray-600 mb-4">
                Select multiple images to upload. Accepted formats: JPEG, PNG, WebP. Max size: 5MB per image
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleFileSelect}
                disabled={isUploading}
                className="flex-1"
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
          </div>
        </CardContent>
      </Card>

      {/* Gallery Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : images.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">No images found. Upload your first images to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <Button variant="outline" size="sm" onClick={handleSelectAll}>
              {selectedImages.size === images.length ? 'Deselect All' : 'Select All'}
            </Button>
            <p className="text-sm text-gray-600">
              {images.length} image(s) total - Drag images to reorder
            </p>
          </div>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={images.map(image => image.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image) => (
                  <SortableImage
                    key={image.id}
                    image={image}
                    isSelected={selectedImages.has(image.id)}
                    onToggle={handleToggleImage}
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
              This will permanently delete {selectedImages.size} image(s). This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={bulkDeleteMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={bulkDeleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {bulkDeleteMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Gallery;
