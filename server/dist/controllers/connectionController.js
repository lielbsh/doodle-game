"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleConnection = void 0;
const gameController_1 = require("./gameController");
const Player_1 = require("../models/Player");
const waitingPlayers = [];
const handleConnection = (ws) => {
    ws.send(JSON.stringify({ message: 'Welcome to the game server!' }));
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message.toString());
            if (data.type === 'JOIN_GAME') {
                matchPlayers(ws, data.playerId, data.playerName);
            }
        }
        catch (error) {
            console.error('Invalid message format', error);
        }
    });
    ws.on('close', () => {
        removePlayer(ws);
    });
};
exports.handleConnection = handleConnection;
const matchPlayers = (ws, playerId, playerName) => {
    const player = new Player_1.Player(ws, playerId, playerName);
    if (waitingPlayers.some(p => p.id === playerId)) {
        return;
    }
    if (waitingPlayers.length > 0) {
        const opponent = waitingPlayers.pop();
        if (opponent) {
            (0, gameController_1.startGame)(player, opponent);
        }
    }
    else {
        waitingPlayers.push(player);
        ws.send(JSON.stringify({ type: 'WAITING', message: 'Waiting for another player...' }));
    }
};
const removePlayer = (ws) => {
    const playerIndex = waitingPlayers.findIndex((player) => player.ws === ws);
    if (playerIndex !== -1) {
        waitingPlayers.splice(playerIndex, 1);
    }
    const game = gameController_1.activeGames.find((g) => g.player1.ws === ws || g.player2.ws === ws);
    if (game) {
        const opponent = game.player1.ws === ws ? game.player2 : game.player1;
        (0, gameController_1.removeFromActiveGames)(game);
        opponent.ws.send(JSON.stringify({ type: 'GAME_OVER', message: 'The other player disconnected.', score: game.score }));
        console.log('Game ended due to player disconnection.');
        if (game.pendingTimeout) {
            clearTimeout(game.pendingTimeout);
            game.pendingTimeout = null;
        }
    }
};
