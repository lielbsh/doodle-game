import WebSocket from 'ws';
import { getRandomWords } from '../utils/wordUtils';

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
    console.log("Received game message:", message);

    const game = activeGames.find((g) => g.player1.ws === ws || g.player2.ws === ws);
    if (!game) {
        console.log('no game')
        return
    };  
    
    if (message.type === 'SUBMIT_DRAWING') {
        console.log('drawing recived in backend')  
        handleDrawing(game, ws, message.drawing);

    } else if (message.type === 'SUBMIT_GUESS') {
        handleGuess(game, ws, message.guess);
    }
};

export const startGame = (player1: Player, player2: Player) => {
    console.log(`Game started: ${player1.id} and ${player2.id}`);

    const game: GameSession = {
        player1,
        player2,
        round: 1,
        words: getRandomWords(1,"easy"), 
        drawings: {},
        guesses: {},
        score: 0,
    };

    activeGames.push(game);

    player1.ws.send(JSON.stringify({ type: 'START_GAME', word: game.words[0] }));
    player2.ws.send(JSON.stringify({ type: 'START_GAME', word: game.words[1] }));
};
  

const handleDrawing = (game: GameSession, ws: WebSocket, drawing: string) => {
    const player = game.player1.ws === ws ? game.player1 : game.player2;
    console.log('player:',player.id ,'submit drawing:',drawing);
    game.drawings[player.id] = drawing;

    if (Object.keys(game.drawings).length === 2) {
        console.log('Both players submitted drawings, moving to guessing phase.');

        game.player1.ws.send(JSON.stringify({ 
            type: 'GUESSING_PHASE', 
            drawing: game.drawings[game.player2.id]  // Send Player 2's drawing to Player 1
        }));

        game.player2.ws.send(JSON.stringify({ 
            type: 'GUESSING_PHASE', 
            drawing: game.drawings[game.player1.id]  // Send Player 1's drawing to Player 2
        }));
    }
};
  
const handleGuess = (game: GameSession, ws: WebSocket, guess: string) => {
    const player = game.player1.ws === ws ? game.player1 : game.player2;
    game.guesses[player.id] = guess;

    if (Object.keys(game.guesses).length === 2) {
        evaluateGame(game);
    }
};


const evaluateGame = (game: GameSession) => {
    const { player1, player2, words, guesses } = game;

    const player1Correct = guesses[player1.id] === words[1].toLowerCase();
    const player2Correct = guesses[player2.id] === words[0].toLowerCase();

    game.score += (player1Correct ? 1 : 0) + (player2Correct ? 1 : 0);
    console.log(`Round ${game.round} ended. Score: ${game.score}`);

    player1.ws.send(JSON.stringify({ type: 'GUESS_RESULT', correct: player1Correct }));
    player2.ws.send(JSON.stringify({ type: 'GUESS_RESULT', correct: player2Correct }));

    player1.ws.send(JSON.stringify({ type: 'SCORE_UPDATE', score: game.score }));
    player2.ws.send(JSON.stringify({ type: 'SCORE_UPDATE', score: game.score }));

    game.round < 3 ? startNextRound(game) : endGame(game);
};

const startNextRound = (game: GameSession) => {
    game.round++;
    game.drawings = {};
    game.guesses = {};
    game.words = getRandomWords(game.round, "easy"); // Replace with word generation logic

    game.player1.ws.send(JSON.stringify({ type: 'START_GAME', round: game.round, word: game.words[0] }));
    game.player2.ws.send(JSON.stringify({ type: 'START_GAME', round: game.round, word: game.words[1] }));

    console.log(`Starting round ${game.round}`);
};

const endGame = (game: GameSession) => {
    game.player1.ws.send(JSON.stringify({ type: 'GAME_OVER', score: game.score }));
    game.player2.ws.send(JSON.stringify({ type: 'GAME_OVER', score: game.score }));

    activeGames.splice(activeGames.indexOf(game), 1);
    console.log('Game ended and removed from active sessions.');
};

