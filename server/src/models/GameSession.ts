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

    constructor(player1: Player, player2: Player) {
        this.player1 = player1;
        this.player2 = player2;
        this.round = 1;
        this.words = getRandomWords(this.round,'easy');
        this.drawings = {};
        this.guesses = {};
        this.score = 0;
    }

    startGame() {
        console.log(`Game started: ${this.player1.id} and ${this.player2.id}`);
        this.player1.sendMessage({ type: "START_GAME", word: this.words[0] });
        this.player2.sendMessage({ type: "START_GAME", word: this.words[1] });
    }
    
    handleDrawing(player: Player, drawing: string) {
        console.log(`Player ${player.id} submitted drawing: ${drawing}`);
        this.drawings[player.id] = drawing;

        if (Object.keys(this.drawings).length === 2) {
            console.log("Both players submitted drawings, moving to guessing phase.");

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
        this.guesses[player.id] = guess;

        if (Object.keys(this.guesses).length === 2) {
            this.evaluateGame();
        }
    }

    evaluateGame() {
        const { player1, player2, words, guesses } = this;

        const player1Correct = guesses[player1.id]?.toLowerCase() === words[1]?.toLowerCase();
        const player2Correct = guesses[player2.id]?.toLowerCase() === words[0]?.toLowerCase();

        this.score += (player1Correct ? 1 : 0) + (player2Correct ? 1 : 0);
        console.log(`Round ${this.round} ended. Score: ${this.score}`);

        player1.sendMessage({ type: "GUESS_RESULT", correct: player1Correct });
        player2.sendMessage({ type: "GUESS_RESULT", correct: player2Correct });

        player1.sendMessage({ type: "SCORE_UPDATE", score: this.score });
        player2.sendMessage({ type: "SCORE_UPDATE", score: this.score });

        this.round < 3 ? this.startNextRound() : this.endGame();
    }

    startNextRound() {
        this.round++;
        this.drawings = {};
        this.guesses = {};
        this.words = getRandomWords(this.round, "easy");

        console.log(`Starting round ${this.round}`);
        this.player1.sendMessage({ type: "START_GAME", round: this.round, word: this.words[0] });
        this.player2.sendMessage({ type: "START_GAME", round: this.round, word: this.words[1] });
    }

    endGame() {
        console.log("Game ended.");
        this.player1.sendMessage({ type: "GAME_OVER", score: this.score });
        this.player2.sendMessage({ type: "GAME_OVER", score: this.score });
    }
}
