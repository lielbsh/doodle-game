import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NameEntryModal from "../components/NameEntry";
import "../styles/HomePage.css";
import { X } from "lucide-react";

const HomePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div>
      <header className="app-header">
        <button className="button bn-pink">?</button>
      </header>
      <main>
        <div className="headline">
          <h1>Welcome to the Doodle Game!</h1>
        </div>
        <div className="container">
          {!isModalOpen && (
            <button className="button bn-green" onClick={openModal}>
              Start Play
            </button>
          )}

          {isModalOpen && (
            <NameEntryModal onClose={() => setIsModalOpen(false)} />
          )}
        </div>
      </main>
    </div>
  );
};

export default HomePage;
