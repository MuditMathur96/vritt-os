// File: components/ShellWindow/hooks/useWindowState.ts
import { useState } from 'react';

export const useWindowState = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  
  const handleMinimize = () => {
    setIsMinimized(true);
    if (isMaximized) {
      setIsMaximized(false);
    }
  };
  
  const handleMaximize = () => {
    setIsMaximized(true);
    if (isMinimized) {
      setIsMinimized(false);
    }
  };
  
  const handleRestore = () => {
    setIsMaximized(false);
  };
  
  return {
    isMinimized,
    isMaximized,
    handleMinimize,
    handleMaximize,
    handleRestore
  };
};