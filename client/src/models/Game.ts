import { Player } from "./Player";

export interface GameSession {
    player1: Player;
    player2: Player;
    round: number;
    words: string[];
    score: number;
  }