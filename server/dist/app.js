"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const connectionController_1 = require("./controllers/connectionController");
const gameController_1 = require("./controllers/gameController");
const express_1 = __importDefault(require("express"));
dotenv_1.default.config();
const server = http_1.default.createServer();
const wss = new ws_1.default.Server({ server });
const app = (0, express_1.default)();
app.head('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).end();
}));
wss.on('connection', (ws) => {
    console.log('New client connected');
    (0, connectionController_1.handleConnection)(ws);
    // Listen for game-related messages
    ws.on('message', (message) => {
        try {
            const parsedMessage = JSON.parse(message.toString()); // Ensure JSON parsing
            (0, gameController_1.handleGameMessage)(ws, parsedMessage);
        }
        catch (error) {
            console.error("Error parsing message:", error);
        }
    });
    // Handle client disconnection
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});
// Start the server
server.listen(process.env.PORT || 8000, () => {
    console.log(`Server listening on port ${process.env.PORT || 8080}`);
});
