'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoOverlayProps {
  videoSrc: string;
  onComplete?: () => void;
  canSkip?: boolean;
}

export function VideoOverlay({ videoSrc, onComplete, canSkip = true }: VideoOverlayProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Setup video
    video.playsInline = true;
    video.muted = true; // Start muted to allow autoplay

    const handleEnded = () => {
      setIsVisible(false);
      onComplete?.();
    };

    const startPlayback = async () => {
      try {
        await video.play();
        // Optionally unmute after autoplay starts
        video.muted = false;
      } catch (err) {
        console.error('Video autoplay failed:', err);
      }
    };

    video.addEventListener('ended', handleEnded);
    startPlayback();

    return () => {
      video.removeEventListener('ended', handleEnded);
    };
  }, [onComplete, videoSrc]);

  const handleSkip = () => {
    const video = videoRef.current;
    if (video) {
      video.pause();
    }
    setIsVisible(false);
    onComplete?.();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
        >
          <video
            ref={videoRef}
            src={videoSrc}
            className="max-w-full max-h-full"
            playsInline
            muted // Initial muted state for autoplay
            controls={false} // Hide controls for cinematic effect
            preload="auto"
          />
          {canSkip && (
            <button
              onClick={handleSkip}
              className="absolute bottom-6 right-6 px-4 py-2 bg-white/10 hover:bg-white/20
                       text-white rounded-lg backdrop-blur-sm transition-colors"
            >
              Skip
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
