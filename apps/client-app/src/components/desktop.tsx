import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import ShellTerminal from './applications/shell/shell';
import CoderRoot from './applications/codeai/coder-root';
import WindowManager from './window/window-manager';
import { Calculator, ChartBarStacked, Code, Computer, File, Globe, LucideIcon, Shell } from 'lucide-react';
import { useWindowContext } from '@/context/windows-context';
import Taskbar from './desktop/task-bar';

// Types
interface DesktopIcon {
  id: string;
  title: string;
  icon: string | LucideIcon;
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


  const {addWindow} = useWindowContext();

  // Initialize occupied grid positions
  useEffect(() => {
    
    updateDesktopDimensions();
    window.addEventListener('resize', updateDesktopDimensions);
    return () => {
      window.removeEventListener('resize', updateDesktopDimensions);
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
          onDoubleClick={()=>addWindow(icon.id as any)}
         
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
            {typeof icon.icon === "string"?icon.icon: React.createElement(icon.icon)}
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

        
      {/* Window Manager */}
      <WindowManager />
      </div>
        {/* Taskbar */}
        <Taskbar />
    </div>
  );
};

// Usage example
export const initialIcons: DesktopIcon[] = [
  {
    id: 'code',
    title: 'VS Code',
    icon: Code,
    position: { x: 0, y: 0 }
  },
  {
    id:"calculator",
    title:"Calculator",
    icon:Calculator,
    position:{x:0,y:80}

  },
//   {
//     id: '2',
//     title: 'Recycle Bin',
//     icon: '🗑️',
//     position: { x: 0, y: 80 }
//   },
  {
    id: 'shell',
    title: "Shell",
    icon: Shell,
    position: { x: 0, y: 160 }
  },
  {
    id:"task-manager",
    title:"Task Manager",
    icon:ChartBarStacked,
    position:{x:0,y:240}
  },
  {
    id:"browser",
    title:"Browser",
    icon:Globe,
    position:{x:80,y:0}
  }
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