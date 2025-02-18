import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Canvas from "./Canvas";
import { Player } from "../models/Player";
import wsClient from "../utils/wsClient";

const GamePage: React.FC = () => {
  const location = useLocation();
  const player: Player = location.state?.player;
  const playerName = location.state?.playerName || "Player";
  const [wordToDraw, setWordToDraw] = useState<string>("");
  const [gameState, setGameState] = useState<string>("WAITING");

  useEffect(() => {
    if (player) {
      wsClient.connect(player, (data) => {
        if (data.type === "START_GAME") {
          setGameState("DRAWING");
          setWordToDraw(data.word);
          // Set the timer for drawing phase
        } else if (data.type === "GUESSING_PHASE") {
          setGameState("GUESSING");
          setWordToDraw("...");
        }
      });

      return () => {
        wsClient.close();
      };
    }
  }, [player]);

  if (!player) {
    return <div>No player found!</div>;
  }

  return (
    <div>
      <h1>Game Screen</h1>
      {gameState === "WAITING" && <h2>Waiting for another player...</h2>}
      <>
        <p>Player: {player.name}</p>
        <p>Word to draw: {wordToDraw}</p>
        <p>Timer: {20}</p>
      </>

      <Canvas />
    </div>
  );
};

export default GamePage;
