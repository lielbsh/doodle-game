import React from "react";
import "../styles/StartRoundModal.css";
import { playSound } from "../utils/soundUtils";

interface StartRoundModalProps {
  isOpen: boolean;
  word: string;
  round: number;
  time: number;
}

const StartRoundModal: React.FC<StartRoundModalProps> = ({
  isOpen,
  word,
  round,
  time,
}) => {
  if (!isOpen) return null;

  playSound("sliding");

  return (
    <div className="overlay">
      <div className="content">
        <div className="round-container">
          <p>Round: {round}/3</p>
        </div>

        <div className="draw-word-container">
          <p className="draw-text">Draw</p>
          <h1 className="word-text">{word}</h1>
        </div>

        <div className="time-container">
          <p>In under {time} seconds</p>
        </div>
      </div>
    </div>
  );
};

export default StartRoundModal;
