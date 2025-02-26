import React, { useEffect, useState } from "react";
import wsClient from "../utils/wsClient";
import { Timer } from "../models/Timer";
import "../styles/GuessEntry.css";
import { playSound } from "../utils/soundUtils";

interface GuessInputProps {
  setTimeLeft: (state: number) => void;
  time: number;
  isCorrect: boolean;
  showRoundResult: boolean;
}

const GuessInput: React.FC<GuessInputProps> = ({
  setTimeLeft,
  time,
  isCorrect,
  showRoundResult,
}) => {
  const [guess, setGuess] = useState<string>("");
  const [guessingTimer, setGuessingTimer] = useState<Timer | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [timeUp, setTimeUp] = useState<boolean>(false);

  useEffect(() => {
    // Create and start the timer
    const newTimer = new Timer(time, () => {
      setTimeUp(true);
    });
    newTimer.start(setTimeLeft);
    setGuessingTimer(newTimer);

    return () => newTimer.stop(); // Cleanup timer
  }, []);

  useEffect(() => {
    if (timeUp) {
      handleGuessSubmit();
    }
  }, [timeUp]);

  const handleGuessSubmit = () => {
    if (!hasSubmitted) {
      wsClient.sendGuessMessage(guess.trim());
      setHasSubmitted(true);
      guessingTimer?.stop();
    }
  };

  return (
    <div className="guess-container">
      <input
        className={`guess-input ${
          showRoundResult ? (isCorrect ? "correct" : "wrong") : ""
        }`}
        type="text"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleGuessSubmit()}
        placeholder="Enter your guess..."
        disabled={hasSubmitted}
      />
      <button
        className="guess-button"
        onClick={() => {
          handleGuessSubmit();
          playSound("click");
        }}
        disabled={hasSubmitted}
      >
        {hasSubmitted ? "Guess Submitted" : "Submit Guess"}
      </button>
    </div>
  );
};

export default GuessInput;
