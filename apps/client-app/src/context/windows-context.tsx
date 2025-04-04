import Browser from "@/components/applications/browser/browser";
import { Calculator as CalculatorApp } from "@/components/applications/calculator/calculator";
import CoderRoot from "@/components/applications/codeai/coder-root";
import VSCodeUI from "@/components/applications/codeai/vscode";
import ShellTerminal from "@/components/applications/shell/shell";
import TaskManager from "@/components/applications/task-manager/task-manager";
import { Calculator, ChartBarStacked, Code, Globe, LucideIcon, Shell } from "lucide-react";
import { nanoid } from "nanoid";
import React,{ createContext, ReactNode, useContext, useState } from "react";


interface AppData{
  component:React.FC<{}>,
  title:string,
  icon:LucideIcon
}

export const apps:Record<string,AppData>={
  "calculator":{
    component:CalculatorApp,
    title:"Calculator",
    icon:Calculator
  },
  "shell":{
    title:"Terminal",
    component:ShellTerminal,
    icon:Shell
  },
  "code":{
    title:"Code Editor",
    component:VSCodeUI,
    icon:Code
  },
  "task-manager":{
    title:"Task Manager",
    component:TaskManager,
    icon:ChartBarStacked
  },
  "browser":{
    title:"Browser",
    component:Browser,
    icon:Globe
  }
}


interface IWindow{
    id:keyof typeof apps ,
    title:string,
    isMaximized:boolean,
    isMinimized:boolean,
    zIndex:number,
    state:any,
    icon:LucideIcon
}


interface IWindowState{
    windows:IWindow[];
    setWindows:React.Dispatch<React.SetStateAction<IWindow[]>>;

    topZIndex:number,
    setTopZIndex:React.Dispatch<React.SetStateAction<number>>;

    maximizeWindow:(id:string)=>void,
    minimizeWindow:(id:string)=>void,
    bringToFront:(id:string)=>void,

    addWindow:(id:keyof typeof apps)=>void;
    closeWindow:(id:string)=>void;
}

const DEFAULT_STATE:IWindowState={
    windows:[],
    setWindows:()=>{},

    topZIndex:50,
    setTopZIndex:()=>{},

    addWindow:()=>{},
    closeWindow:()=>{},
    maximizeWindow:()=>{},
    minimizeWindow:()=>{},
    bringToFront:()=>{}


}


const windowContext = createContext(DEFAULT_STATE);

export function WindowContextProvider({children}:{children:ReactNode}){

    const [windows,setWindows] = useState<IWindow[]>([]);
    const [topZIndex,setTopZIndex] = useState<number>(0);

    const addWindow = (id:keyof typeof apps) => {
      console.log("inside add window",id);
        if(windows.find(win=>win.id === id )) {
            //do not open new just put on top
            bringToFront(id);
            return;
        }
        setWindows([...windows, { id, title: apps[id].title,icon:apps[id].icon, isMinimized: false, isMaximized: false, zIndex: topZIndex,state:{} }]);
        setTopZIndex(topZIndex + 1);
      };
    
      const bringToFront = (id: string) => {
        setWindows(prev=>prev.map(win => win.id === id ? { ...win, zIndex: topZIndex } : win));
        setTopZIndex(topZIndex + 1);
      };
    
      const closeWindow = (id: string) => {
        setWindows(windows.filter((win) => win.id !== id));
      };
    
      const minimizeWindow = (id: string) => {
        setWindows(
          windows.map((win) =>
            win.id === id ? { ...win, isMinimized: !win.isMinimized } : win
          )
        );
      };
    
      const maximizeWindow = (id: string) => {
       
        setWindows([]);
        setWindows(
          windows.map((win) =>
            win.id === id ? { ...win, isMaximized: !win.isMaximized } : win
          )
        );
       
      };

    return <windowContext.Provider
    value={{
        windows,
        setWindows:setWindows,
        addWindow,
        closeWindow,
        maximizeWindow,
        minimizeWindow,
        bringToFront,
        topZIndex,
        setTopZIndex
    }}
    >
        {children}    
    </windowContext.Provider>


}


export function useWindowContext(){

    const state = useContext(windowContext);

    if(!state) throw new Error("Use window context inside window provider!");
    return state;

}

