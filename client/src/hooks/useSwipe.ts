import { useCallback, useEffect, useRef, useState } from 'react';

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeStart?: () => void;
  onSwipeEnd?: () => void;
}

export function useSwipe(handlers: SwipeHandlers) {
  const touchStartX = useRef<number | null>(null);
  const touchStartTime = useRef<number>(0);
  const hasMoved = useRef(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Minimum swipe distance (in px) to trigger a swipe
  const minSwipeDistance = 50;
  // Velocity threshold for momentum swipe (px/ms)
  const velocityThreshold = 0.3;
  // Minimum move distance to consider it a drag (not a tap)
  const dragThreshold = 10;

  // Use a ref to always have the latest handlers without re-registering listeners
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.targetTouches[0].clientX;
      touchStartTime.current = Date.now();
      hasMoved.current = false;
      // Don't set isDragging to true yet — wait until finger actually moves
      handlersRef.current.onSwipeStart?.();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartX.current === null) return;
      
      const currentX = e.targetTouches[0].clientX;
      const diff = currentX - touchStartX.current;
      
      // Only start dragging once the finger has moved beyond the threshold
      if (!hasMoved.current && Math.abs(diff) > dragThreshold) {
        hasMoved.current = true;
        setIsDragging(true);
      }

      if (hasMoved.current) {
        // Apply resistance at boundaries (rubber band effect)
        const resistance = 0.5;
        setDragOffset(diff * resistance);
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartX.current === null) return;

      const touchEndX = e.changedTouches[0].clientX;
      const distance = touchStartX.current - touchEndX;
      const duration = Date.now() - touchStartTime.current;
      const velocity = Math.abs(distance) / duration;

      // Only trigger swipe if the finger actually moved
      if (hasMoved.current) {
        const isLeftSwipe = distance > minSwipeDistance || (distance > 20 && velocity > velocityThreshold);
        const isRightSwipe = distance < -minSwipeDistance || (distance < -20 && velocity > velocityThreshold);

        if (isLeftSwipe && handlersRef.current.onSwipeLeft) {
          handlersRef.current.onSwipeLeft();
        } else if (isRightSwipe && handlersRef.current.onSwipeRight) {
          handlersRef.current.onSwipeRight();
        }
      }

      // Reset
      setDragOffset(0);
      setIsDragging(false);
      hasMoved.current = false;
      touchStartX.current = null;
      handlersRef.current.onSwipeEnd?.();
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return { ref: elementRef, dragOffset, isDragging };
}
