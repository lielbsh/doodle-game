import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Canvas from "./Canvas";
import { Player } from "../models/Player";
import wsClient from "../utils/wsClient";
import GuessInput from "./GuessEntry";
import { RoundResult } from "../models/RoundResult";
import StartRoundModal from "./StartRoundModal";

const GamePage: React.FC = () => {
  const location = useLocation();
  const player: Player = location.state?.player;
  const [wordToDraw, setWordToDraw] = useState<string>("");
  const [gameState, setGameState] = useState<string>("WAITING");
  const [showRoundResult, setShowRoundResult] = useState<boolean>(false);

  const time = 5;
  const [timeLeft, setTimeLeft] = useState<number>(time);

  const [secondPlayerDrawing, setSecondPlayerDrawing] = useState<
    { x: number; y: number }[] | null
  >(null);
  const [roundResult, setRoundResult] = useState<RoundResult>({
    otherPlayerWord: "",
    guessedWord: "",
    isCorrect: false,
    score: 0,
    round: 1,
  });

  useEffect(() => {
    if (!player) return;
    setShowRoundResult(false);

    const handleMessage = (data: any) => {
      if (data.type === "START_GAME") {
        setGameState("START_GAME");
        setWordToDraw(data.word);
        setTimeout(() => setGameState("DRAWING"), 5000);
      } else if (data.type === "GUESSING_PHASE") {
        setGameState("GUESSING_PHASE");
        setSecondPlayerDrawing(JSON.parse(data.drawing));
      } else if (data.type === "ROUND_RESULT") {
        setRoundResult({
          otherPlayerWord: data.otherPlayerWord,
          guessedWord: data.guessedWord,
          isCorrect: data.correct,
          score: data.score,
          round: data.nextRound,
        });
        setShowRoundResult(true);
      } else if (data.type === "GAME_OVER") {
        setGameState("GAME_OVER");
        console.log(`Game over. Final score: ${data.score}`);
      }
    };

    wsClient.connect(player, handleMessage);

    return () => {
      wsClient.close();
    };
  }, [player]);

  return (
    <>
      <StartRoundModal
        isOpen={gameState === "START_GAME"}
        word={wordToDraw}
        round={roundResult.round}
        time={time}
      />

      <div className="header">
        <div className="timer">
          <p>Time: {timeLeft}</p>
        </div>
        {gameState === "WAITING" && (
          <h2 className="waiting-message">Waiting for another player...</h2>
        )}
        {gameState === "DRAWING" && <h2>draw: {wordToDraw}</h2>}
        <div className="player-info">
          <p>
            Score: <strong>{roundResult.score}</strong>
          </p>
          <p>
            Player: <strong>{player.name}</strong>
          </p>
        </div>
      </div>

      {gameState === "DRAWING" && (
        <div className="drawing-phase">
          <Canvas
            player={player}
            setGameState={setGameState}
            secondPlayerDrawing={null}
            gameState={gameState}
            setTimeLeft={setTimeLeft}
            time={time}
          />
        </div>
      )}

      {gameState === "GUESSING_PHASE" && (
        <div className="guessing-phase">
          <h3>Guess the Drawing</h3>
          <GuessInput setTimeLeft={setTimeLeft} time={time} />
          {showRoundResult && (
            <p>other player draw: {roundResult.otherPlayerWord}</p>
          )}
          <Canvas
            player={player}
            setGameState={setGameState}
            secondPlayerDrawing={secondPlayerDrawing}
            gameState={gameState}
            setTimeLeft={setTimeLeft}
            time={time}
          />
        </div>
      )}
    </>
  );
};

export default GamePage;
