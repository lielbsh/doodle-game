import WebSocket from 'ws';
import http from 'http';
import dotenv from 'dotenv';
import { handleConnection } from './controllers/connectionController';
import { handleGameMessage } from './controllers/gameController';

dotenv.config();

const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('New client connected');
  
  handleConnection(ws);

  // Listen for game-related messages
  ws.on('message', (message) => {
    try {
      handleGameMessage(ws, message);
    } catch (error) {
      console.error(error);
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