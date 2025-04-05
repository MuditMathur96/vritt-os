"use client"
import { useRef, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { X, Minus, Maximize } from "lucide-react";
import { useDraggable } from "@/hooks/useDraggable";

import { useWindowContext } from "@/context/windows-context";
import AppRenderer from "../applications/renderer.tsx/app-renderer";

interface WindowProps {
  id: string;
  title: string;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  bringToFront: (id: string) => void;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  children:ReactNode;
}

const Window = ({ children,id, title, onClose, onMinimize, onMaximize, bringToFront, isMinimized, isMaximized, zIndex }: WindowProps) => {
  const windowRef = useRef<HTMLDivElement>(null);
  const { position, handleMouseDown } = useDraggable(windowRef, isMaximized);

  return (
    <div
      ref={windowRef}
      className={`bg-gray-800
        flex flex-col h-[40px]
        overflow-hidden rounded shadow-lg  ${isMaximized ? "w-screen h-[calc(100%-48px)] top-0 left-0 fixed " : "max-w-[calc(100vw-10px)] absolute w-[400px] max-h-[600px] h-[600px]"}`}
      style={{ left: !isMaximized ? position.x : 0, top: !isMaximized ? position.y : 0, zIndex }}
      onMouseDown={() => bringToFront(id)}
    >  
      <div className="window-header flex justify-between items-center text-gray-200 bg-gray-800 px-2 py-1 cursor-move" onMouseDown={handleMouseDown}>
        <span>{title}</span>
        <div className="flex gap-2">
          <Button className="hover:bg-gray-600" variant="ghost" size="icon" onClick={() => onMinimize(id)}>
            <Minus size={16} />
          </Button>
          <Button className="hover:bg-gray-600" variant="ghost" size="icon" onClick={() => { onMaximize(id); bringToFront(id); }}>
            <Maximize size={16} />
          </Button>
          <Button  className="hover:bg-gray-600" variant="ghost" size="icon" onClick={() => onClose(id)}>
            <X size={16} />
          </Button>
        </div>
      </div>
      {!isMinimized && <div className=" flex-1 pb-2 ">{children}</div>}
    </div>
  );
};



export default function WindowManager() {
  const {windows,
    setWindows,
    topZIndex,setTopZIndex,
    addWindow,closeWindow,
    maximizeWindow,minimizeWindow,
    bringToFront
  } = useWindowContext();

  

  return (
    <div className="">
      {windows.map((win) => (
        !win.isMinimized && <Window
          key={win.id}
          id={win.id}
          title={win.title}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={maximizeWindow}
          bringToFront={bringToFront}
          isMinimized={win.isMinimized}
          isMaximized={win.isMaximized}
          zIndex={win.zIndex}
        >
        
            <AppRenderer id={win.id} />
            

            
        </Window>
      ))}
    </div>
  );
}
