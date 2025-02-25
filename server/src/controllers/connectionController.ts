import WebSocket from 'ws';
import { activeGames, removeFromActiveGames, startGame } from './gameController';
import { Player } from '../models/Player';
import { GameSession } from '../models/GameSession';

const waitingPlayers: Player[] = [];

export const handleConnection = (ws: WebSocket) => {
  ws.send(JSON.stringify({ message: 'Welcome to the game server!' }));

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());

      if (data.type === 'JOIN_GAME') {
        matchPlayers(ws, data.playerId, data.playerName);
      }
    } catch (error) {
      console.error('Invalid message format', error);
    }
  });

  ws.on('close', () => {
    removePlayer(ws);
  });
};

const matchPlayers = (ws: WebSocket, playerId: string, playerName: string) => {
    const player = new Player(ws, playerId, playerName);

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
  const playerIndex = waitingPlayers.findIndex((player) => player.ws === ws);
  if (playerIndex !== -1) {
    waitingPlayers.splice(playerIndex, 1);
  }
  
  // Check if the player is part of an active game
  const game = activeGames.find((g) => g.player1.ws === ws || g.player2.ws === ws);
  if (game) {
    const opponent = game.player1.ws === ws ? game.player2 : game.player1;
    removeFromActiveGames(game);
    opponent.ws.send(JSON.stringify({ type: 'GAME_OVER', message: 'The other player disconnected.', score: game.score}));
    console.log('Game ended due to player disconnection.');
  }

};

