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
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
const ws_1 = __importDefault(require("ws"));
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const server = http_1.default.createServer();
const wss = new ws_1.default.Server({ server });
wss.on('connection', (ws) => {
    // Send a message to the client
    ws.send(JSON.stringify({ message: 'Welcome to the game server!' }));
    // Listen for messages from the client
    ws.on('message', (message) => __awaiter(void 0, void 0, void 0, function* () {
    }));
    // Handle client disconnection
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});
// app.get('/', (req: Request, res: Response) => {
//   res.send('Hello World from TypeScript Express!');
// });
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });
// Start the server
server.listen(process.env.PORT || 8080, () => {
    console.log(`Server listening on port ${process.env.PORT || 8080}`);
});
