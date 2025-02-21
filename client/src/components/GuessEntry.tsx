import React, { useEffect, useState } from "react";
import wsClient from "../utils/wsClient";
import { Timer } from "../models/Timer";

// interface CanvasProps {

// }

const GuessInput: React.FC = () => {
  const time = 15;
  const [guess, setGuess] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(time);
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
    <div>
      <p>Time left: {timeLeft}</p>
      <input
        type="text"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        placeholder="Enter your guess..."
        disabled={hasSubmitted} // Prevents further input after submission
      />
      <button onClick={handleGuessSubmit} disabled={hasSubmitted}>
        {hasSubmitted ? "Guess Submitted" : "Submit Guess"}
      </button>
    </div>
  );
};

export default GuessInput;
