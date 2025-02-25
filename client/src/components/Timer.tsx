import React, { useEffect, useState } from "react";
import { playSound, stopAllSounds } from "../utils/soundUtils";

interface TimerProps {
  timeLeft: number;
}

const Timer: React.FC<TimerProps> = ({ timeLeft }) => {
  const [isCritical, setIsCritical] = useState(timeLeft < 5);

  useEffect(() => {
    setIsCritical(timeLeft < 5);
    if (timeLeft == 5) playSound("timer");
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <div className={`timer ${isCritical ? "text-red" : ""}`}>
      <p>{formatTime(timeLeft)}</p>
    </div>
  );
};

export default Timer;
