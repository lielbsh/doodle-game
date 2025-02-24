import WebSocket from 'ws';
import { Player } from "../models/Player";
import { GameSession } from "../models/GameSession";

export const activeGames: GameSession[] = [];

export const handleGameMessage = (ws: WebSocket, message: any) => {
    console.log("Received game message:", message);

    const game = activeGames.find((g) => g.player1.ws === ws || g.player2.ws === ws);
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

export const startGame = (player1: Player, player2: Player) => {
    console.log(`Game started: ${player1.name} and ${player2.name}`);

    const game = new GameSession(player1, player2, () => removeFromActiveGames(game));

    activeGames.push(game);

    game.startGame(); // Send the words 
};

export const removeFromActiveGames = (game: GameSession) => {
    const index = activeGames.indexOf(game);
    if (index !== -1) {
      activeGames.splice(index, 1);
      console.log('Game removed from activeGames.');
    }
  };
  