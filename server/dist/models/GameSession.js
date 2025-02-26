"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameSession = void 0;
const wordUtils_1 = require("../utils/wordUtils");
class GameSession {
    constructor(player1, player2, onGameEnd) {
        this.pendingTimeout = null;
        this.player1 = player1;
        this.player2 = player2;
        this.round = 1;
        this.words = (0, wordUtils_1.getRandomWords)(this.round);
        this.drawings = {};
        this.guesses = {};
        this.score = 0;
        this.onGameEnd = onGameEnd;
    }
    startGame() {
        console.log(`Game started: ${this.player1.id} and ${this.player2.id}`);
        this.player1.sendMessage({ type: "START_GAME", word: this.words[0], round: this.round });
        this.player2.sendMessage({ type: "START_GAME", word: this.words[1], round: this.round });
    }
    handleDrawing(player, drawing) {
        console.log(`Player ${player.id} submitted drawing`);
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
    handleGuess(player, guess) {
        this.guesses[player.id] = guess;
        if (Object.keys(this.guesses).length === 2) {
            console.log("Both players submitted guesses.");
            this.evaluateGame();
        }
    }
    evaluateGame() {
        var _a, _b, _c, _d;
        const { player1, player2, words, guesses } = this;
        const player1Correct = ((_a = guesses[player1.id]) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === ((_b = words[1]) === null || _b === void 0 ? void 0 : _b.toLowerCase());
        const player2Correct = ((_c = guesses[player2.id]) === null || _c === void 0 ? void 0 : _c.toLowerCase()) === ((_d = words[0]) === null || _d === void 0 ? void 0 : _d.toLowerCase());
        this.score += (player1Correct ? 1 : 0) + (player2Correct ? 1 : 0);
        console.log(`Round ${this.round} ended. Score: ${this.score}`);
        player1.sendMessage({
            type: "ROUND_RESULT",
            otherPlayerWord: words[1],
            correct: player1Correct,
            guessedWord: guesses[player2.id],
            score: this.score,
        });
        player2.sendMessage({
            type: "ROUND_RESULT",
            otherPlayerWord: words[0],
            correct: player2Correct,
            guessedWord: guesses[player1.id],
            score: this.score,
        });
        this.pendingTimeout = setTimeout(() => {
            if (this.round < 3) {
                this.startNextRound();
            }
            else {
                this.endGame();
            }
            this.pendingTimeout = null;
        }, 5000);
    }
    startNextRound() {
        this.drawings = {};
        this.guesses = {};
        this.round++;
        this.words = (0, wordUtils_1.getRandomWords)(this.round);
        console.log(`Starting round ${this.round}`);
        this.player1.sendMessage({ type: "START_GAME", round: this.round, word: this.words[0] });
        this.player2.sendMessage({ type: "START_GAME", round: this.round, word: this.words[1] });
    }
    endGame() {
        console.log("Game ended.");
        this.player1.sendMessage({ type: "GAME_OVER", message: "Game ended", score: this.score });
        this.player2.sendMessage({ type: "GAME_OVER", message: "Game ended", score: this.score });
        this.onGameEnd(); // Notify gameController
    }
}
exports.GameSession = GameSession;
