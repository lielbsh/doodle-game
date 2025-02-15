const WebSocket = require('ws');

const ws = new WebSocket("ws://localhost:8080");

ws.on("open", () => {
    console.log("Connected to WebSocket server!");
    ws.send(JSON.stringify({ message: "Hello Server!" }));
});

ws.on("message", (data) => {
    console.log("Received from server:", data.toString());
});

ws.on("close", () => {
    console.log("WebSocket closed.");
});
