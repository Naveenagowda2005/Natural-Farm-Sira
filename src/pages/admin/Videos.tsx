import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { videosApi, Video } from '@/lib/api';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Loader2, Video as VideoIcon } from 'lucide-react';

interface VideoFormData {
  title: string;
  video_url: string;
  uploadType: 'url' | 'file';
}

const Videos = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [deletingVideo, setDeletingVideo] = useState<Video | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<VideoFormData>({
    title: '',
    video_url: '',
    uploadType: 'url',
  });
  const [formErrors, setFormErrors] = useState<Partial<VideoFormData>>({});

  // Fetch videos
  const { data: videos = [], isLoading } = useQuery({
    queryKey: ['videos'],
    queryFn: videosApi.getAll,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: ({ data, file }: { data: { title: string; video_url?: string; video_type: 'url' | 'file' }; file?: File }) =>
      videosApi.create(data, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      toast({
        title: 'Success',
        description: 'Video added successfully',
      });
      handleCloseForm();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add video',
        variant: 'destructive',
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { title: string } }) =>
      videosApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      toast({
        title: 'Success',
        description: 'Video updated successfully',
      });
      handleCloseForm();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update video',
        variant: 'destructive',
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: videosApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      toast({
        title: 'Success',
        description: 'Video deleted successfully',
      });
      setIsDeleteOpen(false);
      setDeletingVideo(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete video',
        variant: 'destructive',
      });
    },
  });

  const validateForm = (): boolean => {
    const errors: Partial<VideoFormData> = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (formData.uploadType === 'url') {
      if (!formData.video_url.trim()) {
        errors.video_url = 'Video URL is required';
      } else {
        // Validate YouTube or Vimeo URL
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
        const vimeoRegex = /^(https?:\/\/)?(www\.)?vimeo\.com\/.+/;
        
        if (!youtubeRegex.test(formData.video_url) && !vimeoRegex.test(formData.video_url)) {
          errors.video_url = 'Please enter a valid YouTube or Vimeo URL';
        }
      }
    } else if (formData.uploadType === 'file' && !selectedFile && !editingVideo) {
      errors.video_url = 'Please select a video file';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['video/mp4', 'video/webm'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an MP4 or WebM video',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Video must be less than 50MB',
        variant: 'destructive',
      });
      return;
    }

    setSelectedFile(file);
  };

  const handleOpenAdd = () => {
    setEditingVideo(null);
    setFormData({
      title: '',
      video_url: '',
      uploadType: 'url',
    });
    setFormErrors({});
    setSelectedFile(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (video: Video) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      video_url: video.video_url,
      uploadType: video.video_type,
    });
    setFormErrors({});
    setSelectedFile(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingVideo(null);
    setFormData({
      title: '',
      video_url: '',
      uploadType: 'url',
    });
    setFormErrors({});
    setSelectedFile(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (editingVideo) {
      // Only update title for existing videos
      updateMutation.mutate({
        id: editingVideo.id,
        data: { title: formData.title },
      });
    } else {
      // Create new video
      if (formData.uploadType === 'url') {
        createMutation.mutate({
          data: {
            title: formData.title,
            video_url: formData.video_url,
            video_type: 'url',
          },
        });
      } else {
        createMutation.mutate({
          data: { 
            title: formData.title,
            video_type: 'file',
          },
          file: selectedFile!,
        });
      }
    }
  };

  const handleOpenDelete = (video: Video) => {
    setDeletingVideo(video);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingVideo) {
      deleteMutation.mutate(deletingVideo.id);
    }
  };

  const getVideoThumbnail = (video: Video): string | null => {
    if (video.video_type === 'url') {
      // Extract YouTube video ID
      const youtubeMatch = video.video_url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
      if (youtubeMatch) {
        return `https://img.youtube.com/vi/${youtubeMatch[1]}/mqdefault.jpg`;
      }
      
      // Extract Vimeo video ID
      const vimeoMatch = video.video_url.match(/vimeo\.com\/(\d+)/);
      if (vimeoMatch) {
        // Vimeo thumbnails require API call, so we'll just show a placeholder
        return null;
      }
    }
    return null;
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Videos</h1>
          <p className="text-gray-600 mt-2">Manage video content</p>
        </div>
        <Button onClick={handleOpenAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Video
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : videos.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">No videos found. Add your first video to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video) => {
            const thumbnail = getVideoThumbnail(video);
            return (
              <Card key={video.id}>
                <CardHeader>
                  {thumbnail ? (
                    <img
                      src={thumbnail}
                      alt={video.title}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 rounded-md mb-4 flex items-center justify-center">
                      <VideoIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <CardTitle className="text-lg">{video.title}</CardTitle>
                  <CardDescription>
                    {video.video_type === 'url' ? 'External URL' : 'Uploaded File'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEdit(video)}
                      className="flex-1"
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDelete(video)}
                      className="flex-1"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingVideo ? 'Edit Video' : 'Add Video'}
            </DialogTitle>
            <DialogDescription>
              {editingVideo
                ? 'Update the video title'
                : 'Add a video by URL or upload a file'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter video title"
                  disabled={isSubmitting}
                />
                {formErrors.title && (
                  <p className="text-sm text-red-500">{formErrors.title}</p>
                )}
              </div>

              {!editingVideo && (
                <>
                  <div className="space-y-2">
                    <Label>Upload Type</Label>
                    <RadioGroup
                      value={formData.uploadType}
                      onValueChange={(value: 'url' | 'file') =>
                        setFormData({ ...formData, uploadType: value })
                      }
                      disabled={isSubmitting}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="url" id="url" />
                        <Label htmlFor="url" className="font-normal">
                          YouTube or Vimeo URL
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="file" id="file" />
                        <Label htmlFor="file" className="font-normal">
                          Upload Video File
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {formData.uploadType === 'url' ? (
                    <div className="space-y-2">
                      <Label htmlFor="video_url">Video URL</Label>
                      <Input
                        id="video_url"
                        value={formData.video_url}
                        onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                        placeholder="https://www.youtube.com/watch?v=..."
                        disabled={isSubmitting}
                      />
                      {formErrors.video_url && (
                        <p className="text-sm text-red-500">{formErrors.video_url}</p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="video_file">Video File</Label>
                      <Input
                        id="video_file"
                        type="file"
                        accept="video/mp4,video/webm"
                        onChange={handleFileSelect}
                        disabled={isSubmitting}
                      />
                      <p className="text-xs text-gray-500">
                        Accepted formats: MP4, WebM. Max size: 50MB
                      </p>
                      {formErrors.video_url && (
                        <p className="text-sm text-red-500">{formErrors.video_url}</p>
                      )}
                    </div>
                  )}
                </>
              )}
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
                {editingVideo ? 'Update' : 'Add'}
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
              This will permanently delete the video "{deletingVideo?.title}".
              This action cannot be undone.
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

export default Videos;
