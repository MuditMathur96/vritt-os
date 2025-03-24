// File: components/ShellWindow/ShellWindowHeader.tsx
import React from 'react';

interface ShellWindowHeaderProps {
  title: string;
  onMinimize: () => void;
  onMaximize: () => void;
  onClose?: () => void;
  onDragStart: (e: React.MouseEvent) => void;
  isMaximized: boolean;
}

const WindowHeader: React.FC<ShellWindowHeaderProps> = ({
  title,
  onMinimize,
  onMaximize,
  onClose,
  onDragStart,
  isMaximized
}) => {
  return (
    <div 
      className="bg-gray-800 px-4 py-2 flex items-center justify-between cursor-move"
      onMouseDown={onDragStart}
    >
      <div className="flex items-center gap-1">
        <span className="text-sm font-semibold">{title}</span>
      </div>
      <div className="flex space-x-2">
        <button 
          className="w-3 h-3 bg-yellow-500 rounded-full focus:outline-none hover:bg-yellow-400"
          onClick={onMinimize}
          aria-label="Minimize"
        />
        <button 
          className="w-3 h-3 bg-green-500 rounded-full focus:outline-none hover:bg-green-400"
          onClick={onMaximize}
          aria-label={isMaximized ? "Restore" : "Maximize"}
        />
        {onClose && (
          <button 
            className="w-3 h-3 bg-red-500 rounded-full focus:outline-none hover:bg-red-400"
            onClick={onClose}
            aria-label="Close"
          />
        )}
      </div>
    </div>
  );
};

export default WindowHeader;