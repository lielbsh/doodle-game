import WebSocket from "ws";

export class Player {
    ws: WebSocket;
    id: string;
    name: string;

    constructor(ws: WebSocket, id: string, name: string) {
        this.ws = ws;
        this.id = id;
        this.name = name;
    }

    sendMessage(message: object) {
        this.ws.send(JSON.stringify(message));
    }
}