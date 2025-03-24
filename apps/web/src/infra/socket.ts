import { Socket,Server, DefaultEventsMap } from "socket.io";
import {Application} from 'express';
import { createServer } from "http";

type EventFunc = (io:Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,data:any)=>Promise<void>

export default class SocketServer{

    public socket;
    private connectedSockets:Record<string,any> = {};
    private events:{name:string,func:EventFunc}[]=[];
    constructor(){0
        this.socket = new Server({
            cors:{
                origin:"*"
            }
        });
     
    }

    init(app:Application){
        const server = createServer(app);
        this.socket.attach(server);
        console.log("socket listening ")

        this.socket.on("connection",(io)=>{
            console.log("new user connected");
            this.connectedSockets[io.id]={io};

            this.events.forEach(({name,func})=>{
                io.on(name,async(data)=>{
                        await func(io,data);
                });
            });

        });

        return server;

    }

    addEvent<T>(name:string,func:EventFunc){

        this.events.push({
            name,
            func
        });

    }   


}