import WebSocket from 'ws';
import { startGame } from './gameController';

interface Player {
  ws: WebSocket;
  id: string;
}

const waitingPlayers: Player[] = [];

export const handleConnection = (ws: WebSocket) => {
  ws.send(JSON.stringify({ message: 'Welcome to the game server!' }));

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());

      if (data.type === 'JOIN_GAME') {
        matchPlayers(ws, data.playerId);
      }
    } catch (error) {
      console.error('Invalid message format', error);
    }
  });

  ws.on('close', () => {
    removePlayer(ws);
  });
};

const matchPlayers = (ws: WebSocket, playerId: string) => {
    const player: Player = { ws, id: playerId };

    // Prevent duplicate waiting players
    if (waitingPlayers.some(p => p.id === playerId)) {
        return;
    }

    if (waitingPlayers.length > 0) {
        const opponent = waitingPlayers.pop();
    if (opponent) {
        startGame(player, opponent)
    }
    } else {
        waitingPlayers.push(player);
        ws.send(JSON.stringify({ type: 'WAITING', message: 'Waiting for another player...' }));
    }
};


const removePlayer = (ws: WebSocket) => {
  const index = waitingPlayers.findIndex((player) => player.ws === ws);
  if (index !== -1) {
    waitingPlayers.splice(index, 1);
  }
};
