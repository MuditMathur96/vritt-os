// File: components/ShellWindow/ShellWindowContainer.tsx
import { useDraggable } from '@/hooks/useDraggable';
import { useWindowState } from '@/hooks/useWindowState';
import React, { useState, useRef, useEffect } from 'react';
import WindowHeader from './window-header';


interface ShellWindowContainerProps {
  title: string;
  children: React.ReactNode;
  initialPosition?: { x: number; y: number };
  onClose?: () => void;
}

const WindowContainer: React.FC<ShellWindowContainerProps> = ({
  title,
  children,
  initialPosition = { x: 20, y: 20 },
  onClose,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { position, handleMouseDown } = useDraggable(containerRef, initialPosition);
  const { isMinimized, isMaximized, handleMinimize, handleMaximize, handleRestore } = useWindowState();

  // Determine window styles based on state
  const getWindowStyles = () => {
    if (isMaximized) {
      return {
        position: 'fixed',
        top: 1,
        left: 0,
        right: 0,
        bottom: 0,
        transform: 'none',
        width: '100vw',
        height: 'calc(100vh - 48px)',
        zIndex: 80,
        //borderRadius: 0
      };
    }
    
    if (isMinimized) {
      return {
        position: 'fixed',
        bottom: '10px',
        left: `${position.x}px`,
        height: '40px',
        width: '200px',
        zIndex: 40,
        overflow: 'hidden'
      };
    }
    
    return {
      position: 'fixed',
      top: `${position.y}px`,
      left: `${position.x}px`,
      transform: 'translate(0, 0)',
      zIndex: 30
    };
  };

  return (
    <div 
      ref={containerRef}
      className={`${!isMaximized && "max-w-3xl"} flex flex-col w-full h-96 bg-gray-900 text-gray-100 rounded-md overflow-hidden border border-gray-800 font-mono text-sm`}
      style={getWindowStyles() as React.CSSProperties}
    >
      {/* Header */}
      <WindowHeader 
        title={title}
        onMinimize={handleMinimize}
        onMaximize={isMaximized ? handleRestore : handleMaximize}
        onClose={onClose}
        onDragStart={handleMouseDown}
        isMaximized={isMaximized}
      />
      
      {/* Content area - hidden when minimized */}
      {!isMinimized && (
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      )}
    </div>
  );
};

export default WindowContainer;