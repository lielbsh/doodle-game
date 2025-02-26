"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
class Player {
    constructor(ws, id, name) {
        this.ws = ws;
        this.id = id;
        this.name = name;
    }
    sendMessage(message) {
        this.ws.send(JSON.stringify(message));
    }
}
exports.Player = Player;
