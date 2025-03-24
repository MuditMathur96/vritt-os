import ExpressServer from "./infra/server";
import Config from "./config/config";
import SocketServer from "./infra/socket";
import Terminal from "./infra/terminal";

const serverInstance = new ExpressServer();
const socketServer = new SocketServer();
const terminal = new Terminal();





socketServer.addEvent("message",async(io,message)=>{
    console.log("message",message);
    io.emit("message","message received");
});

socketServer.addEvent("terminal:write",async(io,text)=>{
    terminal.write(text);    
});

terminal.onData((data)=>{
    console.log(data);
    socketServer.socket.emit("terminal:update",data);
});


const app =serverInstance.createServer();
const serverWithSocket = socketServer.init(app);


serverWithSocket.listen(Config.PORT,()=>{
    console.log("Server started at",Config.PORT);
})