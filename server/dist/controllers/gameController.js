"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFromActiveGames = exports.startGame = exports.handleGameMessage = exports.activeGames = void 0;
const GameSession_1 = require("../models/GameSession");
exports.activeGames = [];
const handleGameMessage = (ws, message) => {
    console.log("Received game message:", message);
    const game = exports.activeGames.find((g) => g.player1.ws === ws || g.player2.ws === ws);
    if (!game) {
        console.log("No game found");
        return;
    }
    const player = game.player1.ws === ws ? game.player1 : game.player2;
    switch (message.type) {
        case "SUBMIT_DRAWING":
            console.log("Drawing received in backend");
            game.handleDrawing(player, message.drawing);
            break;
        case "SUBMIT_GUESS":
            game.handleGuess(player, message.guess);
            break;
    }
};
exports.handleGameMessage = handleGameMessage;
const startGame = (player1, player2) => {
    console.log(`Game started: ${player1.name} and ${player2.name}`);
    const game = new GameSession_1.GameSession(player1, player2, () => (0, exports.removeFromActiveGames)(game));
    exports.activeGames.push(game);
    game.startGame(); // Send the words 
};
exports.startGame = startGame;
const removeFromActiveGames = (game) => {
    const index = exports.activeGames.indexOf(game);
    if (index !== -1) {
        exports.activeGames.splice(index, 1);
        console.log('Game removed from activeGames.');
    }
};
exports.removeFromActiveGames = removeFromActiveGames;
