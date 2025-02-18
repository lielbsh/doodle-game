import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface NameEntryModalProps {
  onClose: () => void;
}

const NameEntryModal: React.FC<NameEntryModalProps> = ({ onClose }) => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleConfirm = () => {
    if (name.trim()) {
      navigate("/game", { state: { playerName: name } });
    }
  };

  return (
    <div className="modal">
      <h2>Enter Your Name</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
      />
      <button onClick={handleConfirm}>Confirm</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

export default NameEntryModal;
