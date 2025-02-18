import React from "react";
import { useLocation } from "react-router-dom";
import Canvas from "./Canvas";

const GamePage: React.FC = () => {
  const location = useLocation();
  const playerName = location.state?.playerName || "Player";

  return (
    <div>
      <h1>Game Screen</h1>
      <p>Player: {playerName}</p>
      <p>Word to draw: (To be implemented)</p>
      <p>Timer: (To be implemented)</p>
      <Canvas />
    </div>
  );
};

export default GamePage;
