import { useRef } from 'react';

export function useLongPress(
  onLongPress: (id?: any) => void,
  //   onShortPress: (id?:any) => void,
  { delay = 600, moveThreshold = 10 } = {}
) {
  const timerRef = useRef<number>(null);
  const isLongPress = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);

  return (id?: any) => {
    const start = (e: React.TouchEvent | React.MouseEvent) => {
      isLongPress.current = false;

      if ('touches' in e) {
        startX.current = e.touches[0].clientX;
        startY.current = e.touches[0].clientY;
      }

      timerRef.current = setTimeout(() => {
        onLongPress?.(id);
        isLongPress.current = true;
      }, delay);
    };

    const move = (e: React.TouchEvent) => {
      if (!timerRef.current) return;

      const dx = Math.abs(e.touches[0].clientX - startX.current);
      const dy = Math.abs(e.touches[0].clientY - startY.current);

      if (dx > moveThreshold || dy > moveThreshold) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    const clear = () => {
      clearTimeout(timerRef.current!);
      if (!isLongPress.current) {
        //   onShortPress?.(id);
      }
    };

    return {
      onMouseDown: start,
      onMouseUp: clear,
      onMouseLeave: clear,
      onTouchStart: start,
      onTouchEnd: clear,
      onTouchCancel: clear,
      onTouchMove: move,
    };
  };
}
