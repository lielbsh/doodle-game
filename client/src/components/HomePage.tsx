import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NameEntryModal from "../components/NameEntry";

const HomePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div>
      <h1>Welcome to Doodle Game</h1>
      {!isModalOpen && <button onClick={openModal}>Start Play</button>}
      {isModalOpen && <NameEntryModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default HomePage;
