import WebSocket from 'ws';

interface Player {
    ws: WebSocket;
    id: string;
  }
  
const waitingPlayers: Player[] = []; // Queue for matchmaking

export const handleConnection = (ws: WebSocket, wss: WebSocket.Server) => {
console.log('New player connected');

ws.on('message', (message) => {
    const data = JSON.parse(message.toString());

    if (data.type === 'JOIN_GAME') {
    matchPlayers(ws, data.playerId);
    }
});

ws.on('close', () => {
    console.log('Player disconnected');
    removePlayer(ws);
});
};

const matchPlayers = (ws: WebSocket, playerId: string) => {}
const startGame = (player1: Player, player2: Player) => {}
const removePlayer = (ws: WebSocket) => {}