import "../styles/GamePage.css";
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
  const [gameState, setGameState] = useState<string>("DRAWING");
  const [showRoundResult, setShowRoundResult] = useState<boolean>(false);
  const [round, setRound] = useState<number>(1);
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
  });

  useEffect(() => {
    if (!player) return;
    setShowRoundResult(false);

    const handleMessage = (data: any) => {
      if (data.type === "START_GAME") {
        setRound(data.round);
        setWordToDraw(data.word);
        setGameState("START_GAME");
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
      <header className="game-header">
        <div className="round">{round}/3</div>
        <div className="row">
          <div className="player-info">
            <p>
              Score: <strong>{roundResult.score}</strong>
            </p>
            <p>
              Player: <strong>{player.name}</strong>
            </p>
          </div>

          <div className="headline">
            {gameState === "DRAWING" && (
              <span>
                draw: <strong>{wordToDraw}</strong>
              </span>
            )}
            {gameState === "GUESSING_PHASE" && (
              <span className="fixed-text">Guess the Drawing</span>
            )}
          </div>

          <div className="timer">00:0{timeLeft}</div>
        </div>
      </header>

      <StartRoundModal
        isOpen={gameState === "START_GAME"}
        word={wordToDraw}
        round={round}
        time={time}
      />

      <div className="game-box">
        {gameState === "WAITING" && (
          <h2 className="waiting-message">Waiting for another player...</h2>
        )}

        {gameState === "DRAWING" && (
          <Canvas
            player={player}
            setGameState={setGameState}
            secondPlayerDrawing={null}
            gameState={gameState}
            setTimeLeft={setTimeLeft}
            time={time}
          />
        )}

        {gameState === "GUESSING_PHASE" && (
          <>
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
          </>
        )}
      </div>
    </>
  );
};

export default GamePage;
