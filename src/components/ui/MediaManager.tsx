
import { useEffect } from 'react';

export function MediaManager() {
  useEffect(() => {
    let isCleaningUp = false;

    // Improved media conflict handler
    const handleMediaConflict = () => {
      if (isCleaningUp) return;
      
      try {
        // Get all audio and video elements
        const audioElements = document.querySelectorAll('audio') as NodeListOf<HTMLAudioElement>;
        const videoElements = document.querySelectorAll('video') as NodeListOf<HTMLVideoElement>;
        
        // Safely pause audio elements
        audioElements.forEach(audio => {
          try {
            if (!audio.paused && !audio.ended) {
              audio.pause();
            }
          } catch (error) {
            console.warn('Failed to pause audio element:', error);
          }
        });
        
        // Safely pause video elements
        videoElements.forEach(video => {
          try {
            if (!video.paused && !video.ended) {
              video.pause();
            }
          } catch (error) {
            console.warn('Failed to pause video element:', error);
          }
        });
      } catch (error) {
        console.warn('Media conflict handler error:', error);
      }
    };

    // Improved play event handler
    const handlePlay = (event: Event) => {
      if (isCleaningUp) return;
      
      try {
        const target = event.target as HTMLMediaElement;
        
        // Only proceed if target is valid
        if (!target || !target.play) return;
        
        // Get all media elements
        const allMedia = document.querySelectorAll('audio, video') as NodeListOf<HTMLMediaElement>;
        
        // Pause other media elements
        allMedia.forEach(media => {
          try {
            if (media !== target && !media.paused && !media.ended) {
              media.pause();
            }
          } catch (error) {
            console.warn('Failed to pause media element during play event:', error);
          }
        });
      } catch (error) {
        console.warn('Play event handler error:', error);
      }
    };

    // Error handler for media elements
    const handleMediaError = (event: Event) => {
      const target = event.target as HTMLMediaElement;
      console.warn('Media element error:', target?.error?.message || 'Unknown media error');
    };

    // Add event listeners with proper error handling
    try {
      document.addEventListener('play', handlePlay, { capture: true, passive: true });
      document.addEventListener('error', handleMediaError, { capture: true, passive: true });
    } catch (error) {
      console.warn('Failed to add media event listeners:', error);
    }
    
    // Cleanup function
    return () => {
      isCleaningUp = true;
      
      try {
        document.removeEventListener('play', handlePlay, { capture: true });
        document.removeEventListener('error', handleMediaError, { capture: true });
        
        // Final cleanup of media elements
        handleMediaConflict();
      } catch (error) {
        console.warn('Cleanup error in MediaManager:', error);
      }
    };
  }, []);

  return null; // Component ini tidak render apapun, hanya manage media
}
