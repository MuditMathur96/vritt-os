"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
class ExpressServer {
    app = null;
    createServer() {
        this.app = (0, express_1.default)();
        return this.app;
    }
    startServer(port) {
        this.app?.listen(port, () => {
            console.log("Server started at", port);
        });
    }
}
exports.default = ExpressServer;
