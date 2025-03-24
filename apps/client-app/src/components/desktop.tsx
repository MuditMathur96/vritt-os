import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import ShellTerminal from './applications/shell';
import CoderRoot from './applications/codeai/coder-root';

// Types
interface DesktopIcon {
  id: string;
  title: string;
  icon: string;
  position: { x: number; y: number };
}

interface GridPosition {
  row: number;
  col: number;
}

interface WindowsDesktopProps {
  icons?: DesktopIcon[];
  gridSize?: number;
  backgroundColor?: string;
}

const Desktop: React.FC<WindowsDesktopProps> = ({
  icons = [],
  gridSize = 80,
  backgroundColor = '#008080' // Classic Windows teal background
}) => {
  const [desktopIcons, setDesktopIcons] = useState<DesktopIcon[]>(icons);
  const [occupiedPositions, setOccupiedPositions] = useState<Set<string>>(new Set());
  const desktopRef = useRef<HTMLDivElement>(null);
  const [desktopDimensions, setDesktopDimensions] = useState({ width: 0, height: 0 });
  const [gridDimensions, setGridDimensions] = useState({ rows: 0, cols: 0 });
  const [currentTime,setCurrentTime] = useState<Date>(new Date());

  // Initialize occupied grid positions
  useEffect(() => {

    let timer:NodeJS.Timeout;

    timer = setInterval(()=>{
        setCurrentTime(new Date());
    },1000 * 60);
    updateDesktopDimensions();
    window.addEventListener('resize', updateDesktopDimensions);
    return () => {
      window.removeEventListener('resize', updateDesktopDimensions);
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (desktopDimensions.width > 0 && desktopDimensions.height > 0) {
      const rows = Math.floor(desktopDimensions.height / gridSize);
      const cols = Math.floor(desktopDimensions.width / gridSize);
      setGridDimensions({ rows, cols });
    }
  }, [desktopDimensions, gridSize]);

  useEffect(() => {
    const positions = new Set<string>();
    desktopIcons.forEach(icon => {
      const gridPos = pixelToGrid(icon.position);
      positions.add(`${gridPos.row},${gridPos.col}`);
    });
    setOccupiedPositions(positions);
  }, [desktopIcons]);

  const updateDesktopDimensions = () => {
    if (desktopRef.current) {
      setDesktopDimensions({
        width: desktopRef.current.offsetWidth,
        height: desktopRef.current.offsetHeight
      });
    }
  };

  const pixelToGrid = (position: { x: number; y: number }): GridPosition => {
    return {
      row: Math.floor(position.y / gridSize),
      col: Math.floor(position.x / gridSize)
    };
  };

  const gridToPixel = (gridPosition: GridPosition) => {
    return {
      x: gridPosition.col * gridSize,
      y: gridPosition.row * gridSize
    };
  };

  const findNearestFreeGridPosition = (gridPos: GridPosition): GridPosition => {
    if (!isPositionOccupied(gridPos)) {
      return gridPos;
    }

    // Spiral search for the nearest free position
    let layer = 1;
    while (layer < Math.max(gridDimensions.rows, gridDimensions.cols)) {
      // Check positions in the current layer (spiral outward)
      for (let i = -layer; i <= layer; i++) {
        for (let j = -layer; j <= layer; j++) {
          // Skip positions that aren't on the perimeter of this layer
          if (Math.abs(i) < layer && Math.abs(j) < layer) continue;

          const newRow = gridPos.row + i;
          const newCol = gridPos.col + j;

          // Check if position is valid and free
          if (isValidPosition({ row: newRow, col: newCol }) && 
              !isPositionOccupied({ row: newRow, col: newCol })) {
            return { row: newRow, col: newCol };
          }
        }
      }
      layer++;
    }

    // Fallback to original position if no free space found
    return gridPos;
  };

  const isValidPosition = (gridPos: GridPosition): boolean => {
    return (
      gridPos.row >= 0 &&
      gridPos.col >= 0 &&
      gridPos.row < gridDimensions.rows &&
      gridPos.col < gridDimensions.cols
    );
  };

  const isPositionOccupied = (gridPos: GridPosition): boolean => {
    return occupiedPositions.has(`${gridPos.row},${gridPos.col}`);
  };

  const handleDragEnd = (event: any, info: any, iconId: string) => {
    const newIcons = [...desktopIcons];
    const iconIndex = newIcons.findIndex(icon => icon.id === iconId);
    
    if (iconIndex !== -1) {
      // Calculate the new grid position
      const currentPixelPos = {
        x: info.point.x,
        y: info.point.y
      };
      
      const gridPos = pixelToGrid(currentPixelPos);
      
      // Find nearest free position if this one is occupied by another icon
      const targetGridPos = findNearestFreeGridPosition(gridPos);
      const snappedPixelPos = gridToPixel(targetGridPos);
      
      // Update the icon position
      newIcons[iconIndex].position = snappedPixelPos;
      setDesktopIcons(newIcons);
    }
  };

  // For debugging: render the grid lines
  const renderGridLines = () => {
    const lines = [];
    
    // Vertical lines
    for (let i = 0; i <= gridDimensions.cols; i++) {
      lines.push(
        <div
          key={`vertical-${i}`}
          style={{
            position: 'absolute',
            left: `${i * gridSize}px`,
            top: 0,
            width: '1px',
            height: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
          }}
        />
      );
    }
    
    // Horizontal lines
    for (let i = 0; i <= gridDimensions.rows; i++) {
      lines.push(
        <div
          key={`horizontal-${i}`}
          style={{
            position: 'absolute',
            left: 0,
            top: `${i * gridSize}px`,
            width: '100%',
            height: '1px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
          }}
        />
      );
    }
    
    return lines;
  };

  return (
    <div
      ref={desktopRef}
      className="h-[calc(100vh-48px)] bg-[url('/wallpaper-1.jpg')] bg-cover bg-center"
      style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Uncomment to show grid lines */}
      {/* {renderGridLines()} */}
      
      {desktopIcons.map(icon => (
        <motion.div
          key={icon.id}
          drag
          dragMomentum={false}
          onDragEnd={(event, info) => handleDragEnd(event, info, icon.id)}
          style={{
            position: 'absolute',
            width: `${gridSize}px`,
            height: `${gridSize}px`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            userSelect: 'none',
            cursor: 'pointer'
          }}
          initial={{ x: icon.position.x, y: icon.position.y }}
          animate={{ x: icon.position.x, y: icon.position.y }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
             backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '4px',
              
            }}
          >
            {icon.icon}
          </div>
          <div
            style={{
              marginTop: '4px',
              color: 'white',
              fontSize: '12px',
              textAlign: 'center',
              maxWidth: '70px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              textShadow: '1px 1px 1px rgba(0, 0, 0, 0.5)'
            }}
          >
            {icon.title}
          </div>
        </motion.div>
      ))}

      <div className='absolute top-0 left-0 z-50'>

        
      {/* <ShellTerminal /> */}
      <CoderRoot />
      </div>
        {/* Taskbar */}
        <motion.div 
            className="h-12 bg-gray-800 flex items-center px-2 fixed bottom-0 w-screen"
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {/* Start Button */}
            <button className="h-10 w-10 flex items-center justify-center hover:bg-gray-700 rounded">
              <div className="grid grid-cols-2 gap-0.5">
                <div className="h-2 w-2 bg-blue-500"></div>
                <div className="h-2 w-2 bg-blue-500"></div>
                <div className="h-2 w-2 bg-blue-500"></div>
                <div className="h-2 w-2 bg-blue-500"></div>
              </div>
            </button>
            
            {/* Search */}
            <div className="ml-2 bg-gray-700 rounded flex items-center px-3 h-8 w-64">
              <svg className="h-4 w-4 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
              <span className="text-gray-400 text-sm">Search</span>
            </div>
            
            {/* Pinned Apps */}
            <div className="flex ml-4 h-full">
              <button className="h-full w-10 flex items-center justify-center hover:bg-gray-700">
                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
                </svg>
              </button>
              <button className="h-full w-10 flex items-center justify-center hover:bg-gray-700">
                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
              </button>
              <button className="h-full w-10 flex items-center justify-center hover:bg-gray-700">
                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z" />
                </svg>
              </button>
            </div>
            
            {/* System tray */}
            <div className="ml-auto flex items-center ">
              <div className="text-white text-sm mr-4">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <button className="h-full w-10 flex items-center justify-center hover:bg-gray-700">
                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7.58 4.08L6.15 2.65C3.75 4.48 2.17 7.3 2.03 10.5h2c.15-2.65 1.51-4.97 3.55-6.42zm12.39 6.42h2c-.15-3.2-1.73-6.02-4.12-7.85l-1.42 1.43c2.02 1.45 3.39 3.77 3.54 6.42zM18 11c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2v-5zm-6 11c.14 0 .27-.01.4-.04.65-.14 1.18-.58 1.44-1.18.1-.24.15-.5.15-.78h-4c.01 1.1.9 2 2.01 2z" />
                </svg>
              </button>
              <button className="h-full w-10 flex items-center justify-center hover:bg-gray-700">
                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
                </svg>
              </button>
              <button className="h-full w-10 flex items-center justify-center hover:bg-gray-700">
                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
                </svg>
              </button>
            </div>
          </motion.div>
    </div>
  );
};

// Usage example
export const initialIcons: DesktopIcon[] = [
  {
    id: '1',
    title: 'My Computer',
    icon: '💻',
    position: { x: 0, y: 0 }
  },
//   {
//     id: '2',
//     title: 'Recycle Bin',
//     icon: '🗑️',
//     position: { x: 0, y: 80 }
//   },
  {
    id: '3',
    title: 'Documents',
    icon: '📁',
    position: { x: 0, y: 160 }
  },
//   {
//     id: '4',
//     title: 'Control Panel',
//     icon: '⚙️',
//     position: { x: 0, y: 240 }
//   },
//   {
//     id: '5',
//     title: 'Internet Explorer',
//     icon: '🌐',
//     position: { x: 0, y: 320 }
//   }
];

export default Desktop;