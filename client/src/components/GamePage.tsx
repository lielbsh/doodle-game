import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Canvas from "./Canvas";
import { Player } from "../models/Player";
import wsClient from "../utils/wsClient";
import GuessInput from "./GuessEntry";
import { RoundResult } from "../models/RoundResult";
import RoundResultModal from "./RoundResultModal";
import StartRoundModal from "./StartRoundModal";

const GamePage: React.FC = () => {
  const location = useLocation();
  const player: Player = location.state?.player;
  const [wordToDraw, setWordToDraw] = useState<string>("");
  const [gameState, setGameState] = useState<string>("WAITING");
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

    const handleMessage = (data: any) => {
      if (data.type === "START_GAME") {
        setGameState("START_GAME");
        setWordToDraw(data.word);
        setTimeout(() => setGameState("DRAWING"), 5);
      } else if (data.type === "GUESSING_PHASE") {
        setGameState("GUESSING_PHASE");
        setSecondPlayerDrawing(JSON.parse(data.drawing));
      } else if (data.type === "ROUND_RESULT") {
        setRoundResult({
          otherPlayerWord: data.otherPlayerWord,
          guessedWord: data.guessedWord,
          isCorrect: data.correct,
          score: data.score,
          round: data.round,
        });
        setGameState("ROUND_RESULT");
        let guessedWord = data.guessedWord;
        console.log("The second player thinks you drew:", guessedWord);
        console.log(
          "The second player drawing was:",
          roundResult.otherPlayerWord
        );
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
      />
      {/* <RoundResultModal
        isOpen={gameState === "ROUND_RESULT" || gameState === "GAME_OVER"}
        onClose={() => {}}
        roundResult={roundResult}
      /> */}

      <div className="header">
        {/* Header Section */}
        <h1>Game Screen</h1>
        <p>{gameState}</p>

        {/* Waiting Message */}
        {gameState === "WAITING" && (
          <h2 className="waiting-message">Waiting for another player...</h2>
        )}

        {/* Player Info Section */}
        <div className="player-info">
          <p>
            Score: <strong>{roundResult.score}</strong>
          </p>
          <p>
            Player: <strong>{player.name}</strong>
          </p>
        </div>

        <div className="drawing-phase"></div>

        {/* Drawing Phase */}
        {gameState === "DRAWING" && (
          <div className="drawing-phase">
            <h3>Drawing Phase</h3>
            <p>
              Word to draw: <strong>{wordToDraw}</strong>
            </p>
            <Canvas
              player={player}
              setGameState={setGameState}
              secondPlayerDrawing={null}
              gameState={gameState}
            />
          </div>
        )}

        {/* Guessing Phase */}
        {gameState === "GUESSING_PHASE" && (
          <div className="guessing-phase">
            <h3>Guess the Drawing</h3>
            <GuessInput />
            <Canvas
              player={player}
              setGameState={setGameState}
              secondPlayerDrawing={secondPlayerDrawing}
              gameState={gameState}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default GamePage;
