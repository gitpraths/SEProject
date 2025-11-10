'use client';

import { useEffect, useRef, useState } from 'react';

export interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

export interface UseSwipeReturn {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
  isSwiping: boolean;
}

export function useSwipe(handlers: SwipeHandlers, threshold = 50): UseSwipeReturn {
  const [isSwiping, setIsSwiping] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const touchEnd = useRef<{ x: number; y: number } | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    touchEnd.current = null;
    touchStart.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    };
    setIsSwiping(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current || !touchEnd.current) {
      setIsSwiping(false);
      return;
    }

    const deltaX = touchStart.current.x - touchEnd.current.x;
    const deltaY = touchStart.current.y - touchEnd.current.y;

    const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);

    if (isHorizontalSwipe) {
      if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0) {
          handlers.onSwipeLeft?.();
        } else {
          handlers.onSwipeRight?.();
        }
      }
    } else {
      if (Math.abs(deltaY) > threshold) {
        if (deltaY > 0) {
          handlers.onSwipeUp?.();
        } else {
          handlers.onSwipeDown?.();
        }
      }
    }

    touchStart.current = null;
    touchEnd.current = null;
    setIsSwiping(false);
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    isSwiping,
  };
}

// Pull-to-refresh hook
export interface UsePullToRefreshReturn {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
  isPulling: boolean;
  pullDistance: number;
}

export function usePullToRefresh(
  onRefresh: () => Promise<void>,
  threshold = 80
): UsePullToRefreshReturn {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const touchStart = useRef<number | null>(null);
  const scrollTop = useRef<number>(0);

  const onTouchStart = (e: React.TouchEvent) => {
    scrollTop.current = window.scrollY || document.documentElement.scrollTop;
    
    // Only allow pull-to-refresh at the top of the page
    if (scrollTop.current === 0) {
      touchStart.current = e.targetTouches[0].clientY;
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStart.current === null || scrollTop.current > 0) return;

    const currentTouch = e.targetTouches[0].clientY;
    const distance = currentTouch - touchStart.current;

    // Only pull down
    if (distance > 0) {
      setIsPulling(true);
      setPullDistance(Math.min(distance, threshold * 1.5));
    }
  };

  const onTouchEnd = async (e: React.TouchEvent) => {
    if (pullDistance >= threshold) {
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      }
    }

    setIsPulling(false);
    setPullDistance(0);
    touchStart.current = null;
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    isPulling,
    pullDistance,
  };
}
