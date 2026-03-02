import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { Play, Loader2, Video as VideoIcon, Heart } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface Video {
  id: string;
  title: string;
  video_url: string | null;
  video_file_url: string | null;
  video_type: 'url' | 'file';
  created_at: string;
}

const fetchPublicVideos = async (): Promise<Video[]> => {
  const response = await fetch(`${API_BASE_URL}/api/videos/public`);
  if (!response.ok) {
    throw new Error('Failed to fetch videos');
  }
  return response.json();
};

const getVideoThumbnail = (video: Video): string => {
  if (video.video_type === 'url' && video.video_url) {
    // YouTube thumbnail
    if (video.video_url.includes('youtube.com') || video.video_url.includes('youtu.be')) {
      const videoId = video.video_url.includes('youtu.be')
        ? video.video_url.split('/').pop()?.split('?')[0]
        : new URL(video.video_url).searchParams.get('v');
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
    // Vimeo thumbnail (placeholder)
    if (video.video_url.includes('vimeo.com')) {
      return 'https://via.placeholder.com/640x360/4a5568/ffffff?text=Vimeo+Video';
    }
  }
  // Default placeholder
  return 'https://via.placeholder.com/640x360/4a5568/ffffff?text=Video';
};

const getVideoEmbedUrl = (video: Video): string | null => {
  if (video.video_type === 'file' && video.video_file_url) {
    return video.video_file_url;
  }
  
  if (video.video_type === 'url' && video.video_url) {
    // YouTube embed
    if (video.video_url.includes('youtube.com') || video.video_url.includes('youtu.be')) {
      const videoId = video.video_url.includes('youtu.be')
        ? video.video_url.split('/').pop()?.split('?')[0]
        : new URL(video.video_url).searchParams.get('v');
      return `https://www.youtube.com/embed/${videoId}`;
    }
    // Vimeo embed
    if (video.video_url.includes('vimeo.com')) {
      const videoId = video.video_url.split('/').pop();
      return `https://player.vimeo.com/video/${videoId}`;
    }
  }
  
  return null;
};

const Videos = () => {
  const { t } = useLanguage();

  const { data: videos = [], isLoading } = useQuery({
    queryKey: ['public-videos'],
    queryFn: fetchPublicVideos,
  });

  return (
    <main className="min-h-screen section-gradient">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-farm-gold/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 animate-fade-in">
              {t('Videos', 'ವೀಡಿಯೊಗಳು')}
            </span>
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-foreground mb-6 animate-fade-in-up">
              {t('Watch Our Videos', 'ನಮ್ಮ ವೀಡಿಯೊಗಳನ್ನು ವೀಕ್ಷಿಸಿ')}
            </h1>
            <p className="text-muted-foreground text-lg animate-fade-in-up stagger-1">
              {t(
                'Learn about our products, farming techniques, and success stories',
                'ನಮ್ಮ ಉತ್ಪನ್ನಗಳು, ಕೃಷಿ ತಂತ್ರಗಳು ಮತ್ತು ಯಶಸ್ಸಿನ ಕಥೆಗಳ ಬಗ್ಗೆ ತಿಳಿಯಿರಿ'
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Videos Grid */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-20">
              <div className="glass-card rounded-2xl p-10 max-w-2xl mx-auto animate-fade-in-up">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <VideoIcon className="w-10 h-10 text-primary" />
                </div>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
                  {t('Videos Coming Soon!', 'ವೀಡಿಯೊಗಳು ಶೀಘ್ರದಲ್ಲೇ!')}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {t(
                    'We\'re working on adding videos about our products, farming tips, and customer testimonials. Stay tuned!',
                    'ನಮ್ಮ ಉತ್ಪನ್ನಗಳು, ಕೃಷಿ ಸಲಹೆಗಳು ಮತ್ತು ಗ್ರಾಹಕ ಪ್ರಶಂಸಾಪತ್ರಗಳ ಬಗ್ಗೆ ವೀಡಿಯೊಗಳನ್ನು ಸೇರಿಸುತ್ತಿದ್ದೇವೆ. ನಿಮ್ಮ ಕಾಯ್ದಿರಿ!'
                  )}
                </p>
                <div className="flex items-center justify-center gap-2 text-primary">
                  <Heart className="w-5 h-5 animate-pulse" />
                  <span className="font-semibold">{t('Follow us for updates', 'ಅಪ್ಡೇಟ್‌ಗಳಿಗಾಗಿ ಫಾಲೋ ಮಾಡಿ')}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
              {videos.map((video) => {
                const thumbnail = getVideoThumbnail(video);
                const embedUrl = getVideoEmbedUrl(video);
                
                return (
                  <div 
                    key={video.id}
                    className="group glass-card rounded-2xl overflow-hidden hover-lift-glow"
                  >
                    {/* Video Thumbnail/Player */}
                    <div className="relative aspect-video bg-muted">
                      {embedUrl ? (
                        video.video_type === 'file' ? (
                          <video
                            src={embedUrl}
                            controls
                            className="w-full h-full object-cover"
                            poster={thumbnail}
                          />
                        ) : (
                          <iframe
                            src={embedUrl}
                            title={video.title}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        )
                      ) : (
                        <>
                          <img
                            src={thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Play className="w-8 h-8 text-primary ml-1" />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    
                    {/* Video Info */}
                    <div className="p-4">
                      <h3 className="font-heading font-bold text-foreground line-clamp-2">
                        {video.title}
                      </h3>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Videos;
