"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./infra/server"));
const config_1 = __importDefault(require("./config/config"));
const socket_1 = __importDefault(require("./infra/socket"));
const terminal_1 = __importDefault(require("./infra/terminal"));
const serverInstance = new server_1.default();
const socketServer = new socket_1.default();
const terminal = new terminal_1.default();
socketServer.addEvent("message", async (io, message) => {
    console.log("message", message);
    io.emit("message", "message received");
});
socketServer.addEvent("terminal:write", async (io, text) => {
    terminal.write(text);
});
terminal.onData((data) => {
    console.log(data);
    socketServer.socket.emit("terminal:update", data);
});
const app = serverInstance.createServer();
const serverWithSocket = socketServer.init(app);
serverWithSocket.listen(config_1.default.PORT, () => {
    console.log("Server started at", config_1.default.PORT);
});
