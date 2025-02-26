import React, { useEffect } from "react";
import "../styles/StartRoundModal.css";
import { useNavigate } from "react-router-dom";
import wsClient from "../utils/wsClient";
import { playSound } from "../utils/soundUtils";

interface GameOverProps {
  isOpen: boolean;
  onPlayAgain: () => void;
  score: number;
  message: string;
}

const GameOverModal: React.FC<GameOverProps> = ({
  isOpen,
  onPlayAgain,
  score,
  message,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (message !== "Game ended") {
      playSound("notification");
    } else {
      playSound("endGame");
    }
  }, [message]);

  const handleExit = () => {
    playSound("click");
    wsClient.close();
    navigate("/");
  };

  if (!isOpen) return null;

  return (
    <div className="overlay">
      <div className="content">
        <h1>Game Ended</h1>
        {message !== "Game ended" && (
          <>
            <h2>{message}</h2>
            {playSound("notification")}
          </>
        )}

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
