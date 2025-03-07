import WebSocket from 'ws';
import http from 'http';
import dotenv from 'dotenv';
import { handleConnection } from './controllers/connectionController';
import { handleGameMessage } from './controllers/gameController';
import express, { Request, Response } from 'express';

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });


app.head('/', async (req: Request, res: Response) => {
  console.log('robot is running')
  res.status(200).send('ok');
});

wss.on('connection', (ws) => {
  console.log('New client connected');
  
  handleConnection(ws);

  // Listen for game-related messages
  ws.on('message', (message) => {
    try {
        const parsedMessage = JSON.parse(message.toString()); // Ensure JSON parsing
        handleGameMessage(ws, parsedMessage);
    } catch (error) {
        console.error("Error parsing message:", error);
    }
  });
  
  // Handle client disconnection
  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Start the server
server.listen(process.env.PORT || 8000, () => {
  console.log(`Server listening on port ${process.env.PORT || 8080}`);
});