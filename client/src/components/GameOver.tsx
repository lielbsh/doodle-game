import React from "react";
import "../styles/StartRoundModal.css";
import { useNavigate } from "react-router-dom";
import wsClient from "../utils/wsClient";

interface GameOverProps {
  isOpen: boolean;
  onPlayAgain: () => void;
  score: number;
}

const GameOverModal: React.FC<GameOverProps> = ({
  isOpen,
  onPlayAgain,
  score,
}) => {
  const navigate = useNavigate();
  const handleExit = () => {
    wsClient.close(); // Optional: close WebSocket if needed
    navigate("/");
  };

  if (!isOpen) return null;

  return (
    <div className="overlay">
      <div className="content">
        <h1>Game Ended</h1>
        <p className="score">Score: {score}</p>

        <div className="buttons">
          <button className="play-again" onClick={onPlayAgain}>
            Play again
          </button>
          <button className="exit" onClick={handleExit}>
            exit
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverModal;
