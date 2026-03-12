export interface Video {
  id: string;
  title: string;
  video_url: string | null;
  video_file_url: string | null;
  video_type: 'url' | 'file';
  display_order: number;
  created_at: Date;
  updated_at: Date;
}
