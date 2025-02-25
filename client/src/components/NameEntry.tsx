import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Player } from "../models/Player";
import { playSound } from "../utils/soundUtils";

interface NameEntryModalProps {
  onClose: () => void;
}

const NameEntryModal: React.FC<NameEntryModalProps> = ({ onClose }) => {
  const [nameInput, setNameInput] = useState("");
  const navigate = useNavigate();

  const handleConfirmName = () => {
    if (nameInput.trim()) {
      playSound("start");
      const newPlayer = new Player(nameInput.trim());
      navigate("/game", { state: { player: newPlayer } }); // Pass player via state
    }
  };

  return (
    <div className="modal">
      <input
        type="text"
        value={nameInput}
        onChange={(e) => setNameInput(e.target.value)}
        placeholder="Your name"
        onKeyDown={(e) => e.key === "Enter" && handleConfirmName()}
      />
      <button
        type="submit"
        onClick={handleConfirmName}
        className="start-button bn-green"
      >
        Start
      </button>
    </div>
  );
};

export default NameEntryModal;
