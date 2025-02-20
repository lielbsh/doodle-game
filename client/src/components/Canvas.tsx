import React, { useRef, useEffect, useState } from "react";
import { Timer } from "../models/Timer";
import wsClient from "../utils/wsClient";
import { Player } from "../models/Player";

interface CanvasProps {
  player: Player;
  setGameState: (state: string) => void;
  gameState: string;
  secondPlayerDrawing: { x: number; y: number }[] | null;
}

const Canvas: React.FC<CanvasProps> = ({
  player,
  setGameState,
  gameState,
  secondPlayerDrawing,
}) => {
  const time = 15;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [drawingStrokes, setDrawingStrokes] = useState<
    { x: number; y: number }[]
  >([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(time);
  const [timer, setTimer] = useState<Timer | null>(null);
  const [timeUp, setTimeUp] = useState<boolean>(false);

  // For drawing phase: start timer.
  useEffect(() => {
    if (gameState !== "DRAWING") return;

    timer?.stop();
    const newTimer = new Timer(time, () => {
      setTimeUp(true);
      console.log("Time's up! Sending drawing...");
    });
    newTimer.start(setTimeLeft);
    setTimer(newTimer);

    return () => newTimer.stop(); // Cleanup timer
  }, [gameState]);

  useEffect(() => {
    if (timeUp && gameState === "DRAWING") {
      handleDrawingEnd();
    }
  }, [timeUp, gameState]);

  // Setup canvas context.
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = 500;
      canvas.height = 300;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.strokeStyle = "black";
        ctxRef.current = ctx;
      }
    }
  }, []);

  // If in guessing phase, update local drawingStrokes from secondPlayerDrawing.
  useEffect(() => {
    if (gameState === "GUESSING_PHASE" && secondPlayerDrawing) {
      setDrawingStrokes(secondPlayerDrawing);
      // Optionally, render the received drawing:
      drawReceivedDrawing(secondPlayerDrawing);
    }
  }, [gameState, secondPlayerDrawing]);

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    if (!canvasRef.current || !ctxRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    ctxRef.current.beginPath(); // Reset path so it doesn’t connect to the last stroke
    ctxRef.current.moveTo(x, y); // Move to the new starting point without drawing

    setDrawingStrokes((prev) => [...prev, { x, y }]);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (
      gameState !== "DRAWING" ||
      !isDrawing ||
      !canvasRef.current ||
      !ctxRef.current
    )
      return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    ctxRef.current.lineTo(x, y);
    ctxRef.current.stroke();

    setDrawingStrokes((prev) => [...prev, { x, y }]);
  };

  const handleDrawingEnd = () => {
    if (!player) return;
    wsClient.sendDrawingMessage(JSON.stringify(drawingStrokes));

    timer?.stop();
    setGameState("GUESSING_PHASE");
  };

  // Function to draw received drawing (guessing phase):
  const drawReceivedDrawing = (strokes: { x: number; y: number }[]) => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        strokes.forEach((point, index) => {
          if (index === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();
      }
    }
  };

  return (
    <>
      <p>Time: {timeLeft}</p>
      <canvas
        ref={canvasRef}
        style={{ border: "1px solid black", cursor: "crosshair" }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
    </>
  );
};

export default Canvas;
