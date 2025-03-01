import { Player } from "./Player";
import { getRandomWords } from "../utils/wordUtils";

export class GameSession {
    player1: Player;
    player2: Player;
    round: number;
    words: string[];
    drawings: Record<string, string>;
    guesses: Record<string, string>;
    score: number;
    onGameEnd: () => void;
    pendingTimeout: NodeJS.Timeout | null = null;

    constructor(player1: Player, player2: Player, onGameEnd: () => void) {
        this.player1 = player1;
        this.player2 = player2;
        this.round = 1;
        this.words = getRandomWords(this.round);
        this.drawings = {};
        this.guesses = {};
        this.score = 0;
        this.onGameEnd = onGameEnd;
    }

    startGame() {
        this.player1.sendMessage({ type: "START_GAME", word: this.words[0], round:this.round });
        this.player2.sendMessage({ type: "START_GAME", word: this.words[1], round:this.round });
    }
    
    handleDrawing(player: Player, drawing: string) {
        this.drawings[player.id] = drawing;

        if (Object.keys(this.drawings).length === 2) {

            this.player1.sendMessage({ 
                type: "GUESSING_PHASE", 
                drawing: this.drawings[this.player2.id] 
            });

            this.player2.sendMessage({ 
                type: "GUESSING_PHASE", 
                drawing: this.drawings[this.player1.id] 
            });
        }
    }

    handleGuess(player: Player, guess: string) {
        this.guesses[player.id] = guess.toLowerCase();

        if (Object.keys(this.guesses).length === 2) {
            this.evaluateGame();
        }
    }

    evaluateGame() {
        const { player1, player2, words, guesses } = this;

        const player1Correct = guesses[player1.id]?.toLowerCase() === words[1]?.toLowerCase();
        const player2Correct = guesses[player2.id]?.toLowerCase() === words[0]?.toLowerCase();

        this.score += (player1Correct ? 1 : 0) + (player2Correct ? 1 : 0);

        player1.sendMessage({ 
            type: "ROUND_RESULT", 
            otherPlayerWord:words[1],  
            correct: player1Correct, 
            guessedWord: guesses[player2.id],
            score: this.score,
        });
        player2.sendMessage({ 
            type: "ROUND_RESULT",
            otherPlayerWord:words[0],  
            correct: player2Correct, 
            guessedWord: guesses[player1.id],
            score: this.score,
        });
 
        this.pendingTimeout = setTimeout(() => {
            if (this.round < 3) {
                this.startNextRound();
            } else {
                this.endGame();
            }
            this.pendingTimeout = null; 
        }, 5000);
    }

    startNextRound() {
        this.drawings = {};
        this.guesses = {};
        this.round++;
        this.words = getRandomWords(this.round);

        this.player1.sendMessage({ type: "START_GAME", round: this.round, word: this.words[0] });
        this.player2.sendMessage({ type: "START_GAME", round: this.round, word: this.words[1] });
    }

    endGame() {
        this.player1.sendMessage({ type: "GAME_OVER", message:"Game ended", score: this.score });
        this.player2.sendMessage({ type: "GAME_OVER", message:"Game ended" ,score: this.score });
        this.onGameEnd(); // Notify gameController
    }
}
