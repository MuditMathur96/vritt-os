"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Config {
    static PORT = parseInt(process.env.PORT || "9000");
}
exports.default = Config;
