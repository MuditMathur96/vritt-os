// File: components/ShellTerminal.tsx
import useIsMounted from '@/hooks/useIsMounted';
import React, { useRef, useEffect, useMemo } from 'react';
import { Terminal } from '@xterm/xterm';
import {FitAddon} from '@xterm/addon-fit';
import "@xterm/xterm/css/xterm.css";
import { io, Socket } from 'socket.io-client';
import { useWindowContext } from '@/context/windows-context';

const ShellTerminal: React.FC = () => {
  const isMounted = useIsMounted();
  const terminalRef = useRef<HTMLDivElement>(null);
  const connectionRef = useRef<Socket | null>(null);
  const xTerminalRef = useRef<any>(null);
  const fitAddOnRef = useRef<FitAddon>(null);

  const {windows} = useWindowContext();

  const isMaximized = useMemo(()=>{

    return windows.find(w=>w.id ==="shell")?.isMaximized;

  },[windows]);


  useEffect(() => {
    if (!isMounted || !terminalRef.current) return;

    const terminal = new Terminal({
      rows: 20,
      
    });

    const fitAddOn = new FitAddon();
    fitAddOnRef.current = fitAddOn;

    
    terminal.loadAddon(fitAddOn);
    xTerminalRef.current = terminal;
    terminal.open(terminalRef.current);
    fitAddOn.fit();

    
    connectionRef.current = io("http://localhost:9000");
    connectionRef.current.connect();
    
    console.log("socket connected");
    
    terminal.onData((data) => {
      if (data === '\x04') {
        // Prevent default behavior
        //terminalRef.current.write('\r\nCtrl+D is disabled.\r\n');
        return;
      }
    
      console.log("user typed: ",data)
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

  useEffect(()=>{

      if(fitAddOnRef.current) fitAddOnRef.current.fit();
      

  },[isMaximized]);

  const handleClose = () => {
    // Cleanup and handle close logic
    if (connectionRef.current) {
      connectionRef.current.disconnect();
    }
    // You might want to implement an onClose callback prop here
  };

  return (
    <div className='w-full h-full'>
      <div 
        ref={terminalRef}
        className="h-full w-full *:terminal-window "
      />
    </div>
    
  );
};

export default ShellTerminal;