
import { useEffect } from 'react';

export function MediaManager() {
  useEffect(() => {
    // Cleanup function untuk mengatasi media playback conflicts
    const handleMediaConflict = () => {
      // Pause semua audio/video elements yang sedang playing
      const audioElements = document.querySelectorAll('audio');
      const videoElements = document.querySelectorAll('video');
      
      audioElements.forEach(audio => {
        if (!audio.paused) {
          audio.pause();
        }
      });
      
      videoElements.forEach(video => {
        if (!video.paused) {
          video.pause();
        }
      });
    };

    // Prevent multiple media playing simultaneously
    const handlePlay = (event: Event) => {
      const target = event.target as HTMLMediaElement;
      
      // Pause other media elements when one starts playing
      const allMedia = document.querySelectorAll('audio, video');
      allMedia.forEach(media => {
        if (media !== target && !media.paused) {
          media.pause();
        }
      });
    };

    // Add event listeners untuk semua media elements
    document.addEventListener('play', handlePlay, true);
    
    // Cleanup saat unmount
    return () => {
      document.removeEventListener('play', handlePlay, true);
      handleMediaConflict();
    };
  }, []);

  return null; // Component ini tidak render apapun, hanya manage media
}
