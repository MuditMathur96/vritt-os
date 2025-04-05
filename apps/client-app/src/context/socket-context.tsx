import Configs from "@/configs/configs";
import useIsMounted from "@/hooks/useIsMounted";
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { Socket,io } from "socket.io-client";


interface ISocketState{

    isConnected:boolean;
    addEvent(name:string,func:any):void;
    removeEvent(name:string):void;
    emit<T>(name:string,data:T):void;
}


const INITIAL_STATE:ISocketState={
    isConnected:false,
    addEvent:()=>{},
    removeEvent:()=>{},
    emit:()=>{}
}

const socketContext = createContext(INITIAL_STATE);

export default function SocketProvider({children}:{children:ReactNode}){

    const isMounted = useIsMounted();
    const connectionRef = useRef<Socket >(null);
    const [connected,setConnected] = useState(false);

    function emit<T>(name:string,data:T){

        if(!connected) return;

        connectionRef.current?.emit(name,data);

    }

    function addEvent(name:string,func:any){
        if(connectionRef.current?.connected){
            connectionRef.current.on(name,func);
        }
    }

    function removeEvent(name:string){

        if(connectionRef.current?.connected){
            connectionRef.current.off(name);
        }

    }

    useEffect(()=>{
        if(!isMounted) return;

        connectionRef.current = io(Configs.OSWebServerUrl);
        connectionRef.current.connect();
        setConnected(true);
      //  console.log("Socket connected to: ",Configs.OSWebServerUrl);

      return ()=>setConnected(false);
    },[isMounted]);

    


    return <socketContext.Provider
    value={{
        isConnected:connected,
        addEvent,
        removeEvent,
        emit
    }}
    >
        {children}

    </socketContext.Provider>


}


export function useSocket(){

    const state = useContext(socketContext);
    
    if(!state) throw new Error("Use useSocket inside SocketProvider!");

    return state;



}