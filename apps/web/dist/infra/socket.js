"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const http_1 = require("http");
class SocketServer {
    socket;
    connectedSockets = {};
    events = [];
    constructor() {
        0;
        this.socket = new socket_io_1.Server({
            cors: {
                origin: "*"
            }
        });
    }
    init(app) {
        const server = (0, http_1.createServer)(app);
        this.socket.attach(server);
        console.log("socket listening ");
        this.socket.on("connection", (io) => {
            console.log("new user connected");
            this.connectedSockets[io.id] = { io };
            this.events.forEach(({ name, func }) => {
                io.on(name, async (data) => {
                    await func(io, data);
                });
            });
        });
        return server;
    }
    addEvent(name, func) {
        this.events.push({
            name,
            func
        });
    }
}
exports.default = SocketServer;
