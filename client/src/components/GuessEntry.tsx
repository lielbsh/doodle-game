import React, { useEffect, useState } from "react";
import wsClient from "../utils/wsClient";
import { Timer } from "../models/Timer";

interface GuessInputProps {
  setTimeLeft: (state: number) => void;
  time: number;
}

const GuessInput: React.FC<GuessInputProps> = ({ setTimeLeft, time }) => {
  const [guess, setGuess] = useState<string>("");

  const [guessingTimer, setGuessingTimer] = useState<Timer | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [timeUp, setTimeUp] = useState<boolean>(false);

  useEffect(() => {
    // Create and start the timer
    const newTimer = new Timer(time, () => {
      setTimeUp(true);
      console.log("time up!");
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
    }
  };

  return (
    <div className="guess-container">
      <input
        className="guess-input"
        type="text"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        placeholder="Enter your guess..."
        disabled={hasSubmitted} // Prevents further input after submission
      />
      <button
        className="guess-button"
        onClick={handleGuessSubmit}
        disabled={hasSubmitted}
      >
        {hasSubmitted ? "Guess Submitted" : "Submit Guess"}
      </button>
    </div>
  );
};

export default GuessInput;
