"use client"
// File: components/ShellTerminal.tsx
import useIsMounted from '@/hooks/useIsMounted';
import React, { useRef, useEffect, useMemo } from 'react';
import { Terminal } from '@xterm/xterm';
import {FitAddon} from '@xterm/addon-fit';

import "@xterm/xterm/css/xterm.css";
import { useWindowContext } from '@/context/windows-context';
import { useSocket } from '@/context/socket-context';
import Configs from '@/configs/configs';



const ShellTerminal: React.FC = () => {


  const isMounted = useIsMounted();
  const terminalRef = useRef<HTMLDivElement>(null);
  const xTerminalRef = useRef<any>(null);
  const fitAddOnRef = useRef<FitAddon>(null);

  const {addEvent,removeEvent,isConnected,emit} = useSocket();

  
  const {windows} = useWindowContext();

  const isMaximized = useMemo(()=>{

    return windows.find(w=>w.id ==="shell")?.isMaximized;

  },[windows]);


  useEffect(() => {
    console.log(isConnected);
    if(!isMounted) return;
    if (!terminalRef.current) return;
    if(!isConnected) return;

    

    const terminal = new Terminal({
      rows: 20,
      
    });

    const fitAddOn = new FitAddon();
    fitAddOnRef.current = fitAddOn;

    
    terminal.loadAddon(fitAddOn);
    xTerminalRef.current = terminal;
    terminal.open(terminalRef.current);
    fitAddOn.fit();
    
    terminal.onData((data) => {
      if (data === '\x04') {
        // Prevent default behavior
        //terminalRef.current!.write('\r\nCtrl+D is disabled.\r\n');
        return;
      }
    
    //  console.log("user typed: ",data)

      // emit default event to make start terminal
      emit(Configs.terminalEvents.terminalWrite,data);

      //TODO:Remove this later
      // connectionRef.current!.emit("terminal:write", data);      
    });
    
    addEvent(Configs.terminalEvents.terminalUpdate,(text: string) => {
    //  console.log("on terminal update: ", text);
      terminal.write(text);
    })
    //TODO:Remove this later
    // connectionRef.current.on("terminal:update", (text: string) => {
    //   console.log("on terminal update: ", text);
    //   terminal.write(text);
    // });
    

    emit(Configs.terminalEvents.terminalWrite,"\n");

    //TODO:remove this later
    //connectionRef.current.emit("terminal:write", "\n");
    
    return () => {
      removeEvent(Configs.terminalEvents.terminalUpdate);

      //TODO:remove this later
      //connectionRef.current?.off("terminal:update");
      //connectionRef.current?.disconnect();
    };
  }, [isConnected,isMounted,terminalRef.current]);

  useEffect(()=>{

      if(fitAddOnRef.current) fitAddOnRef.current.fit();
      

  },[isMaximized]);


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