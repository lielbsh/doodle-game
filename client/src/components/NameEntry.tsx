import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Player } from "../models/Player";

interface NameEntryModalProps {
  onClose: () => void;
}

const NameEntryModal: React.FC<NameEntryModalProps> = ({ onClose }) => {
  const [nameInput, setNameInput] = useState("");
  const navigate = useNavigate();

  const handleConfirmName = () => {
    if (nameInput.trim()) {
      const newPlayer = new Player(nameInput.trim());
      navigate("/game", { state: { player: newPlayer } }); // Pass player via state
    }
  };

  return (
    <div className="modal">
      <h2>Enter Your Name</h2>
      <input
        type="text"
        value={nameInput}
        onChange={(e) => setNameInput(e.target.value)}
        placeholder="Your name"
      />
      <button onClick={handleConfirmName}>Confirm</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

export default NameEntryModal;
