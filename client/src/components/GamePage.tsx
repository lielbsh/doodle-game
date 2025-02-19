import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Canvas from "./Canvas";
import { Player } from "../models/Player";
import wsClient from "../utils/wsClient";
import GuessInput from "./GuessEntry";

const GamePage: React.FC = () => {
  const location = useLocation();
  const player: Player = location.state?.player;
  const [wordToDraw, setWordToDraw] = useState<string>("");
  const [gameState, setGameState] = useState<string>("WAITING");

  useEffect(() => {
    if (!player) return;

    const handleMessage = (data: any) => {
      if (data.type === "START_GAME") {
        setGameState("DRAWING");
        setWordToDraw(data.word);
      } else if (data.type === "GUESSING_PHASE") {
        setGameState("GUESSING_PHASE");
      } else if (data.type === "SCORE_UPDATE") {
        console.log(`Score updated: ${data.score}`);
      } else if (data.type === "GAME_OVER") {
        setGameState("GAME_OVER");
        console.log(`Game over. Final score: ${data.score}`);
      }
    };

    wsClient.connect(player, handleMessage);

    return () => {
      wsClient.close();
    };
  }, [player]);

  return (
    <div>
      <h1>Game Screen</h1>
      <p>{gameState}</p>
      {gameState === "WAITING" && <h2>Waiting for another player...</h2>}

      <div>
        <p>Player: {player.name}</p>
        <p>Word to draw: {wordToDraw}</p>
      </div>

      {gameState === "DRAWING" && (
        <Canvas player={player} setGameState={setGameState} />
      )}
      {gameState === "GUESSING_PHASE" && <GuessInput />}
    </div>
  );
};

export default GamePage;
