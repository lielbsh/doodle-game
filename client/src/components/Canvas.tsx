import React, { useRef, useEffect, useState, ReactElement } from "react";
import { Drawing } from "../models/Drawing";
import { Timer } from "../models/Timer";
import wsClient from "../utils/wsClient";
import { Player } from "../models/Player";

interface CanvasProps {
  player: Player;
  setGameState: (state: string) => void;
}

const Canvas: React.FC<CanvasProps> = ({ player, setGameState }) => {
  const time = 15;
  const [drawingData, setDrawingData] = useState<Drawing>();
  const [timeLeft, setTimeLeft] = useState<number>(time);
  const [timer, setTimer] = useState<Timer | null>(null);
  const [timeUp, setTimeUp] = useState<boolean>(false);

  useEffect(() => {
    timer?.stop();
    // Create and start the timer
    const newTimer = new Timer(time, () => {
      setTimeUp(true);
      console.log("time up!");
    });
    newTimer.start(setTimeLeft);
    setTimer(newTimer);

    return () => newTimer.stop(); // Cleanup timer
  }, []);

  useEffect(() => {
    if (timeUp) {
      handleDrawingEnd();
    }
  });

  const handleDrawingEnd = () => {
    if (!player) return;
    wsClient.sendDrawingMessage(JSON.stringify(drawingData?.strokes)); // change to drawing data

    timer?.stop();
    setGameState("GUESSING_PHASE");
  };

  if (!player) {
    return <div>No player found!</div>;
  }

  return (
    <>
      <p>Time: {timeLeft}</p>
      <div
        style={{ border: "1px solid black", width: "500px", height: "300px" }}
      >
        Canvas Area
      </div>
    </>
  );
};

export default Canvas;
