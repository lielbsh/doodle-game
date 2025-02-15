import WebSocket from 'ws';

interface Player {
  ws: WebSocket;
  id: string;
}

const waitingPlayers: Player[] = [];

export const handleConnection = (ws: WebSocket) => {
  console.log('New player connected');

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
    console.log('Player disconnected');
    removePlayer(ws);
  });
};

const matchPlayers = (ws: WebSocket, playerId: string) => {
  const player: Player = { ws, id: playerId };

  if (waitingPlayers.length > 0) {
    const opponent = waitingPlayers.pop();
    if (opponent) {
      startGame(player, opponent);
    }
  } else {
    waitingPlayers.push(player);
    ws.send(JSON.stringify({ type: 'WAITING', message: 'Waiting for another player...' }));
  }
};

const startGame = (player1: Player, player2: Player) => {
  console.log(`Matched ${player1.id} with ${player2.id}`);

  player1.ws.send(JSON.stringify({ type: 'START_GAME', opponent: player2.id }));
  player2.ws.send(JSON.stringify({ type: 'START_GAME', opponent: player1.id }));
};

const removePlayer = (ws: WebSocket) => {
  const index = waitingPlayers.findIndex((player) => player.ws === ws);
  if (index !== -1) {
    waitingPlayers.splice(index, 1);
  }
};
