import WebSocket from 'ws';

interface Player {
    ws: WebSocket;
    id: string;
}
  
interface GameSession {
    player1: Player;
    player2: Player;
    round: number;
    words: string[],
    drawings: Record<string, string>; 
    guesses: Record<string, string>; 
    score: number; 
}
  
const activeGames: GameSession[] = [];


export const handleGameMessage = (ws: WebSocket, message: any) => {
    const game = activeGames.find((g) => g.player1.ws === ws || g.player2.ws === ws);
    if (!game) return;
  
    if (message.type === 'SUBMIT_DRAWING') {
      handleDrawing(game, ws, message.data);
    } else if (message.type === 'SUBMIT_GUESS') {
      handleGuess(game, ws, message.guess);
    }
};

export const initializeGame = (player1: Player, player2: Player) => {
    console.log(`Game started: ${player1.id} and ${player2.id}`);
  
    const game: GameSession = {
        player1,
        player2,
        round: 1,
        words: ['flower','house'],
        drawings: {},
        guesses: {},
        score: 0,
    };

    activeGames.push(game);

    // Send start game message with words
    player1.ws.send(JSON.stringify({ type: 'START_GAME', word: game.words[0] }));
    player2.ws.send(JSON.stringify({ type: 'START_GAME', word: game.words[1] }));
};
  

const handleDrawing = (game: GameSession, ws: WebSocket, drawing: string) => {
    const player = game.player1.ws === ws ? game.player1 : game.player2;
    game.drawings[player.id] = drawing;

    if (Object.keys(game.drawings).length === 2) {
        console.log('Both players submitted drawings, moving to guessing phase.');

        game.player1.ws.send(JSON.stringify({ type: 'GUESSING_PHASE', drawing: game.drawings[game.player2.id] }));
        game.player2.ws.send(JSON.stringify({ type: 'GUESSING_PHASE', drawing: game.drawings[game.player1.id] }));
    }
};
  
const handleGuess = (game: GameSession, ws: WebSocket, guess: string) => {
    const player = game.player1.ws === ws ? game.player1 : game.player2;
    game.guesses[player.id] = guess;

    if (Object.keys(game.guesses).length === 2) {
        evaluateScores(game);
    }
};

function evaluateScores(game: GameSession) {
    throw new Error('Function not implemented.');
}

