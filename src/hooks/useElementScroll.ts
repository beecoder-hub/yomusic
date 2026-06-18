import React, { useRef, useLayoutEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

export const useElementScroll = () => {
  const location = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);
  // We use a ref to store the timer ID so it persists across renders without causing re-renders
  const timeoutRef = useRef<number>(null);

  // 1. Restore scroll position when route changes
  useLayoutEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      // Unique key for this specific page path
      const key = `scroll-pos-${location.pathname}`;
      const savedPosition = sessionStorage.getItem(key);

      // If we have a saved position, restore it.
      // If not (new page), reset to 0 (top).
      scrollContainer.scrollTop = savedPosition ? parseInt(savedPosition, 10) : 0;
    }
  }, [location.pathname]); // Run every time the path changes

  // 2. Save scroll position on scroll event
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
      // Current scroll value
      const scrollTop = (e.target as HTMLDivElement).scrollTop;
      const key = `scroll-pos-${location.pathname}`;

      // Clear any existing timer (reset the countdown)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set a new timer to save data after 200ms of inactivity
      timeoutRef.current = setTimeout(() => {
        sessionStorage.setItem(key, String(scrollTop));
      }, 400); // 200ms delay
    },
    [location.pathname]
  );

  return { scrollRef, handleScroll };
};
