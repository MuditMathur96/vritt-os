import { useState, useEffect, useCallback, RefObject } from 'react';

interface Position {
  x: number;
  y: number;
}

export const useDraggable = (
  elementRef: RefObject<HTMLElement | null>,
  isMaximized: boolean
) => {
  const [position, setPosition] = useState<Position>({ x: 100, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const taskbarOffset = 48;

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!isMaximized && (e.target as HTMLElement).closest('.cursor-move')) {
       
        setIsDragging(true);
        setDragOffset({
          x: e.clientX - position.x,
          y: e.clientY - position.y,
        });
      }
    },
    [position, isMaximized]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging && elementRef.current) {
        e.preventDefault();

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight - taskbarOffset; // Leave space for the taskbar
        const elementWidth = elementRef.current.offsetWidth;
        const elementHeight = elementRef.current.offsetHeight;

        const maxX = windowWidth - elementWidth;
        const maxY = windowHeight - elementHeight;
        const minX = 0;
        const minY = 0;

        const newX = Math.min(maxX, Math.max(minX, e.clientX - dragOffset.x));
        const newY = Math.min(maxY, Math.max(minY, e.clientY - dragOffset.y));

        setPosition({ x: newX, y: newY });
      }
    },
    [isDragging, dragOffset, elementRef]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  useEffect(() => {
   
    if (isMaximized) {
      setPosition({ x: 0, y: 0 });
    }
  }, [isMaximized]);

  return { position, isDragging, handleMouseDown };
};