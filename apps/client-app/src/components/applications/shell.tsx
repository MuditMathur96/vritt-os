// File: components/ShellTerminal.tsx
import useIsMounted from '@/hooks/useIsMounted';
import React, { useRef, useEffect } from 'react';
import { Terminal } from '@xterm/xterm';
import "@xterm/xterm/css/xterm.css";
import { io, Socket } from 'socket.io-client';
import WindowContainer from './window-container';

const ShellTerminal: React.FC = () => {
  const isMounted = useIsMounted();
  const terminalRef = useRef<HTMLDivElement>(null);
  const connectionRef = useRef<Socket | null>(null);
  const xTerminalRef = useRef<any>(null);

  useEffect(() => {
    if (!isMounted || !terminalRef.current) return;

    const terminal = new Terminal({
      rows: 20
    });
    xTerminalRef.current = terminal;
    terminal.open(terminalRef.current);
    
    connectionRef.current = io("http://localhost:9000");
    connectionRef.current.connect();
    
    console.log("socket connected");
    
    terminal.onData((data) => {
      connectionRef.current!.emit("terminal:write", data);      
    });
    
    connectionRef.current.on("terminal:update", (text: string) => {
      console.log("on terminal update: ", text);
      terminal.write(text);
    });
    
    connectionRef.current.emit("terminal:write", "\n");
    
    return () => {
      connectionRef.current?.off("terminal:update");
      connectionRef.current?.disconnect();
    };
  }, [isMounted]);

  const handleClose = () => {
    // Cleanup and handle close logic
    if (connectionRef.current) {
      connectionRef.current.disconnect();
    }
    // You might want to implement an onClose callback prop here
  };

  return (
    <WindowContainer 
      title="Windows PowerShell" 
      onClose={handleClose}
      initialPosition={{ x: 50, y: 50 }}
    >
      <div 
        ref={terminalRef}
        className="flex-1 terminal-window pb-2 pt-4 overflow-y-auto"
      />
    </WindowContainer>
  );
};

export default ShellTerminal;