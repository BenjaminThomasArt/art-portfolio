import { useEffect, useRef, useState } from 'react';

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeStart?: () => void;
  onSwipeEnd?: () => void;
}

export function useSwipe(handlers: SwipeHandlers) {
  const touchStartX = useRef<number | null>(null);
  const touchStartTime = useRef<number>(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Minimum swipe distance (in px) to trigger a swipe
  const minSwipeDistance = 50;
  // Velocity threshold for momentum swipe (px/ms)
  const velocityThreshold = 0.3;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.targetTouches[0].clientX;
      touchStartTime.current = Date.now();
      setIsDragging(true);
      handlers.onSwipeStart?.();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartX.current) return;
      
      const currentX = e.targetTouches[0].clientX;
      const diff = currentX - touchStartX.current;
      
      // Apply resistance at boundaries (rubber band effect)
      const resistance = 0.5;
      setDragOffset(diff * resistance);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartX.current) return;

      const touchEndX = e.changedTouches[0].clientX;
      const distance = touchStartX.current - touchEndX;
      const duration = Date.now() - touchStartTime.current;
      const velocity = Math.abs(distance) / duration;

      // Check if swipe meets distance OR velocity threshold
      const isLeftSwipe = distance > minSwipeDistance || (distance > 20 && velocity > velocityThreshold);
      const isRightSwipe = distance < -minSwipeDistance || (distance < -20 && velocity > velocityThreshold);

      if (isLeftSwipe && handlers.onSwipeLeft) {
        handlers.onSwipeLeft();
      } else if (isRightSwipe && handlers.onSwipeRight) {
        handlers.onSwipeRight();
      }

      // Reset
      setDragOffset(0);
      setIsDragging(false);
      touchStartX.current = null;
      handlers.onSwipeEnd?.();
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handlers]);

  return { ref: elementRef, dragOffset, isDragging };
}
