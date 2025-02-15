import express, { Request, Response } from 'express';
const app = express();
import WebSocket from 'ws';
import http from 'http';
import dotenv from 'dotenv';
import promisePool from './db'; 

dotenv.config();
const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('New client connected');
  
  // Send a message to the client
  ws.send(JSON.stringify({ message: 'Welcome to the game server!' }));
  
  // Listen for messages from the client
  ws.on('message', async (message) => {
    const parsedMessage = JSON.parse(message.toString());
    console.log('Received:', parsedMessage);
    
  });
  
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
server.listen(process.env.PORT || 8000, () => {
  console.log(`Server listening on port ${process.env.PORT || 8080}`);
});