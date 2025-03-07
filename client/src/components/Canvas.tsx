import React, { useRef, useEffect, useState } from "react";
import { Timer } from "../models/Timer";
import wsClient from "../utils/wsClient";
import { Player } from "../models/Player";
import { Eraser } from "lucide-react";

type Point = {
  x: number;
  y: number;
  newStroke?: boolean;
};

interface CanvasProps {
  player: Player;
  setGameState: (state: string) => void;
  secondPlayerDrawing: Point[] | null;
  gameState: string;
  setTimeLeft: (state: number) => void;
  time: number;
}

const Canvas: React.FC<CanvasProps> = ({
  player,
  setGameState,
  secondPlayerDrawing,
  gameState,
  setTimeLeft,
  time,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  // Local state for drawing strokes in drawing phase.
  const [drawingStrokes, setDrawingStrokes] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [timer, setTimer] = useState<Timer | null>(null);
  const [timeUp, setTimeUp] = useState<boolean>(false);

  // Setup canvas context.
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = 1200;
      canvas.height = 600;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.strokeStyle = "black";
        ctxRef.current = ctx;
      }
    }
  }, []);

  // For drawing phase: start timer.
  useEffect(() => {
    if (gameState === "WAITING") return;
    setTimeLeft(time);
    if (gameState !== "DRAWING") return;

    timer?.stop();
    const newTimer = new Timer(time, () => {
      setTimeUp(true);
    });
    newTimer.start(setTimeLeft);
    setTimer(newTimer);

    return () => newTimer.stop();
  }, [gameState]);

  // If time is up in drawing phase, send drawing and switch phase.
  useEffect(() => {
    if (timeUp && gameState === "DRAWING") {
      handleDrawingEnd();
    }
  }, [timeUp, gameState]);

  // Update local drawingStrokes from secondPlayerDrawing and draw it.
  useEffect(() => {
    if (gameState === "GUESSING_PHASE" && secondPlayerDrawing) {
      setDrawingStrokes(secondPlayerDrawing);
      drawReceivedDrawing(secondPlayerDrawing);
    }
  }, [gameState, secondPlayerDrawing]);

  // Drawing functions for drawing phase:
  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameState === "GUESSING_PHASE") return;
    setIsDrawing(true);
    if (!canvasRef.current || !ctxRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
    // Mark the start of a new stroke.
    setDrawingStrokes((prev) => [...prev, { x, y, newStroke: true }]);
  };

  const draw = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (
      !isDrawing ||
      !canvasRef.current ||
      !ctxRef.current ||
      (gameState !== "DRAWING" && gameState !== "WAITING")
    )
      return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    ctxRef.current.lineTo(x, y);
    ctxRef.current.stroke();
    // Subsequent points are not the start of a new stroke.
    setDrawingStrokes((prev) => [...prev, { x, y, newStroke: false }]);
  };

  const stopDrawing = () => {
    if (gameState === "GUESSING_PHASE") return;
    setIsDrawing(false);
  };

  const handleDrawingEnd = () => {
    wsClient.sendDrawingMessage(JSON.stringify(drawingStrokes));
    timer?.stop();
    setGameState("GUESSING_PHASE");
  };

  // Function to draw received drawing (guessing phase):
  const drawReceivedDrawing = (strokes: Point[]) => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Iterate through each point and start a new path when needed.
        strokes.forEach((point, index) => {
          if (point.newStroke || index === 0) {
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
            ctx.stroke();
          }
        });
      }
    }
  };

  return (
    <>
      <button
        className="bn-clear"
        onClick={() => {
          setDrawingStrokes([]);
          if (canvasRef.current && ctxRef.current) {
            const ctx = ctxRef.current;
            ctx.clearRect(
              0,
              0,
              canvasRef.current.width,
              canvasRef.current.height
            );
          }
        }}
        disabled={gameState === "GUESSING_PHASE"} // Disable button when in "GUESSING_PHASE"
      >
        <Eraser size={35} />
      </button>

      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          className={`canvas ${
            gameState === "DRAWING"
              ? "drawing-phase"
              : gameState === "GUESSING_PHASE"
              ? "guessing-phase"
              : ""
          }`}
          style={{
            cursor:
              gameState === "DRAWING" || gameState === "WAITING"
                ? "crosshair"
                : "default",
            display: "block",
            background: "white",
          }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          width={1200}
          height={500}
        />
      </div>
    </>
  );
};

export default Canvas;
