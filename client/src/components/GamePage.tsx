import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Canvas from "./Canvas";
import { Player } from "../models/Player";
import wsClient from "../utils/wsClient";
import GuessInput from "./GuessEntry";

const GamePage: React.FC = () => {
  const location = useLocation();
  const player: Player = location.state?.player;
  const [wordToDraw, setWordToDraw] = useState<string>("");
  const [gameState, setGameState] = useState<string>("WAITING");
  const [score, setScore] = useState<number>(0);
  const [secondPlayerDrawing, setSecondPlayerDrawing] = useState<
    { x: number; y: number }[] | null
  >(null);
  const [guessResults, setGuessResults] = useState<
    { myGuess: boolean[]; myDrawing: boolean[] }[]
  >([]);

  useEffect(() => {
    if (!player) return;

    const handleMessage = (data: any) => {
      if (data.type === "START_GAME") {
        setGameState("DRAWING");
        setWordToDraw(data.word);
      } else if (data.type === "GUESSING_PHASE") {
        setGameState("GUESSING_PHASE");
        setSecondPlayerDrawing(JSON.parse(data.drawing));
      } else if (data.type === "ROUND_RESULT") {
        setScore(data.score);
        let guessedWord = data.guessedWord;
        console.log("The second player thinks you drew:", guessedWord);
        let correct = data.correct;
        let drawingCorrect = false; // need to implement
        setGuessResults((prev) => {
          // If the guessResults array is empty, create the first entry
          const newEntry = {
            myGuess: prev.length ? [...prev[0].myGuess, correct] : [correct],
            myDrawing: prev.length
              ? [...prev[0].myDrawing, drawingCorrect]
              : [drawingCorrect],
          };

          return [newEntry]; // Return the updated entry as a single row
        });
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
    <div className="header">
      {/* Header Section */}
      <h1>Game Screen</h1>
      <p>{gameState}</p>

      {/* Waiting Message */}
      {gameState === "WAITING" && (
        <h2 className="waiting-message">Waiting for another player...</h2>
      )}

      {/* Guess Results Table */}
      <div className="guess-results">
        <h3>Guess Results</h3>
        <table>
          <thead>
            <tr>
              <th>My Answer</th>
              <th>Other Player's Answer</th>
            </tr>
          </thead>
          <tbody>
            {guessResults.length > 0 && (
              <tr>
                <td>
                  {guessResults[0].myGuess.map((res, i) => (
                    <span key={i}>{res ? "✅" : "❌"} </span>
                  ))}
                </td>
                <td>
                  {guessResults[0].myDrawing.map((res, i) => (
                    <span key={i}>{res ? "✅" : "❌"} </span>
                  ))}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Player Info Section */}
      <div className="player-info">
        <p>
          Score: <strong>{score}</strong>
        </p>
        <p>
          Player: <strong>{player.name}</strong>
        </p>
      </div>

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
  );
};

export default GamePage;
