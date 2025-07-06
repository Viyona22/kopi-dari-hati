
import { useEffect } from 'react';

export function MediaManager() {
  useEffect(() => {
    let isCleaningUp = false;

    // Improved media conflict handler with better error checking
    const handleMediaConflict = () => {
      if (isCleaningUp) return;
      
      try {
        // Get all audio and video elements with existence check
        const audioElements = document.querySelectorAll('audio');
        const videoElements = document.querySelectorAll('video');
        
        // Safely pause audio elements
        audioElements.forEach(audio => {
          try {
            if (audio && !audio.paused && !audio.ended && typeof audio.pause === 'function') {
              audio.pause();
            }
          } catch (error) {
            // Silently handle errors - don't log to avoid console spam
          }
        });
        
        // Safely pause video elements
        videoElements.forEach(video => {
          try {
            if (video && !video.paused && !video.ended && typeof video.pause === 'function') {
              video.pause();
            }
          } catch (error) {
            // Silently handle errors - don't log to avoid console spam
          }
        });
      } catch (error) {
        // Silently handle errors - don't log to avoid console spam
      }
    };

    // Simplified play event handler
    const handlePlay = (event) => {
      if (isCleaningUp || !event || !event.target) return;
      
      try {
        const target = event.target;
        
        // Only proceed if target is a valid media element
        if (!target || typeof target.pause !== 'function') return;
        
        // Get all media elements and pause others
        const allMedia = document.querySelectorAll('audio, video');
        
        allMedia.forEach(media => {
          try {
            if (media !== target && media && !media.paused && !media.ended && typeof media.pause === 'function') {
              media.pause();
            }
          } catch (error) {
            // Silently handle errors
          }
        });
      } catch (error) {
        // Silently handle errors
      }
    };

    // Minimal error handler
    const handleMediaError = (event) => {
      // Just prevent default behavior, don't log to reduce console noise
      if (event && typeof event.preventDefault === 'function') {
        event.preventDefault();
      }
    };

    // Add event listeners with better error handling
    try {
      document.addEventListener('play', handlePlay, { capture: true, passive: true });
      document.addEventListener('error', handleMediaError, { capture: true, passive: true });
    } catch (error) {
      // Silently handle listener setup errors
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
        // Silently handle cleanup errors
      }
    };
  }, []);

  return null; // Component ini tidak render apapun, hanya manage media
}
