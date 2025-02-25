import "../styles/GamePage.css";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Canvas from "./Canvas";
import { Player } from "../models/Player";
import wsClient from "../utils/wsClient";
import GuessInput from "./GuessEntry";
import { RoundResult } from "../models/RoundResult";
import StartRoundModal from "./StartRoundModal";
import Timer from "./Timer";
import GameOverModal from "./GameOver";
import { LogOut } from "lucide-react";
import { playSound } from "../utils/soundUtils";

const GamePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const player: Player = location.state?.player;
  const [wordToDraw, setWordToDraw] = useState<string>("");
  const [gameState, setGameState] = useState<string>("WAITING");
  const [showRoundResult, setShowRoundResult] = useState<boolean>(false);
  const [round, setRound] = useState<number>(1);
  const time = 7;
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
  const [gameEndMessage, setGameEndMessage] = useState<string>("");

  useEffect(() => {
    setShowRoundResult(false);
  }, [round]);

  useEffect(() => {
    if (!player) return;

    const handleMessage = (data: any) => {
      if (data.type === "START_GAME") {
        if (gameState === "WAITING") {
          playSound("start");
        }
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
        setGameEndMessage(data.message);
      } else if (data.type === "WAITING") {
        setGameState("WAITING");
      }
    };

    wsClient.connect(player, handleMessage);

    return () => {
      wsClient.close();
    };
  }, [player]);

  const handlePlayAgain = () => {
    if (player) {
      wsClient.sendMessage({
        type: "JOIN_GAME",
        playerId: player.id,
        playerName: player.name,
      });
    }
  };

  const handleExitGame = () => {
    playSound("notification");
    wsClient.close();
    navigate("/");
    setGameEndMessage("You left the game.");
  };

  return (
    <>
      <header className="game-header">
        <button className="exit-button" onClick={handleExitGame}>
          <LogOut size={30} />
        </button>
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

          <Timer timeLeft={timeLeft} />
        </div>
      </header>

      <StartRoundModal
        isOpen={gameState === "START_GAME"}
        word={wordToDraw}
        round={round}
        time={time}
      />

      <GameOverModal
        isOpen={gameState === "GAME_OVER"}
        onPlayAgain={handlePlayAgain}
        score={roundResult.score}
        message={gameEndMessage}
      />

      <div className="game-box">
        {gameState === "WAITING" && (
          <>
            <h2 className="waiting-message">
              Waiting for another player to join the game...
            </h2>
            <Canvas
              player={player}
              setGameState={setGameState}
              secondPlayerDrawing={null}
              gameState={gameState}
              setTimeLeft={setTimeLeft}
              time={time}
            />
          </>
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
            <div>
              <GuessInput
                setTimeLeft={setTimeLeft}
                time={time}
                isCorrect={roundResult.isCorrect}
                showRoundResult={showRoundResult}
              />
            </div>

            {/* Show round result feedback only if it's available */}
            {showRoundResult && (
              <div className="message-container">
                {!roundResult.isCorrect && (
                  <p className="feedback wrong">
                    The word was: <strong>{roundResult.otherPlayerWord}</strong>
                  </p>
                )}

                {roundResult.guessedWord === wordToDraw ? (
                  <p className="feedback correct">
                    Great job! The other player understood your drawing.
                  </p>
                ) : (
                  <p className="feedback wrong">
                    The other player guessed:{" "}
                    <strong>{roundResult.guessedWord}</strong>
                  </p>
                )}
              </div>
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
function useNevigate() {
  throw new Error("Function not implemented.");
}
