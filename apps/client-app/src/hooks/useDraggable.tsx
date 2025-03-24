// File: components/ShellWindow/hooks/useDraggable.ts
import { useState, useEffect, useCallback, RefObject } from 'react';

interface Position {
  x: number;
  y: number;
}

export const useDraggable = (
  elementRef: RefObject<HTMLElement | null>,
  initialPosition: Position = { x: 0, y: 0 }
) => {
  const [position, setPosition] = useState<Position>(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Only enable dragging when clicking on the header element
    if ((e.target as HTMLElement).closest('.cursor-move')) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  }, [position]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging && elementRef.current) {
      e.preventDefault();
      
      // Get window dimensions
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      // Get element dimensions
      const elementWidth = elementRef.current.offsetWidth;
      const elementHeight = elementRef.current.offsetHeight;
      
      // Calculate maximum allowed positions
      // Keep at least 50px or 25% of the window visible, whichever is less
      const minVisiblePx = Math.min(50, elementWidth * 0.25);
      
      const maxX = windowWidth - minVisiblePx;
      const maxY = windowHeight - minVisiblePx;
      const minX = minVisiblePx - elementWidth;
      const minY = 0; // Allow top of window to align with top of viewport
      
      // Calculate new constrained position
      const newX = Math.min(maxX, Math.max(minX, e.clientX - dragOffset.x));
      const newY = Math.min(maxY, Math.max(minY, e.clientY - dragOffset.y));
      
      setPosition({
        x: newX,
        y: newY
      });
    }
  }, [isDragging, dragOffset, elementRef]);

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

  // Handle window resize to keep window in bounds if viewport changes
  useEffect(() => {
    const handleResize = () => {
      if (elementRef.current) {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const elementWidth = elementRef.current.offsetWidth;
        const elementHeight = elementRef.current.offsetHeight;
        
        // Keep window in bounds after resize
        const minVisiblePx = Math.min(50, elementWidth * 0.25);
        const maxX = windowWidth - minVisiblePx;
        const maxY = windowHeight - minVisiblePx;
        const minX = minVisiblePx - elementWidth;
        const minY = 0;
        
        setPosition(prevPosition => ({
          x: Math.min(maxX, Math.max(minX, prevPosition.x)),
          y: Math.min(maxY, Math.max(minY, prevPosition.y))
        }));
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [elementRef]);

  return { position, isDragging, handleMouseDown };
};