import React from "react";

type Props = {
  players: [string, string]; // two-players names
};

const Game: React.FC<Props> = ({ players }) => {
  return (
    <div>
      <h1>Game</h1>
      <p>
        players: {players[0]} , {players[1]}
      </p>
    </div>
  );
};

export default Game;
