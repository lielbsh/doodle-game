import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NameEntryModal from "../components/NameEntry";
import "../styles/HomePage.css";
import { LogOut, X } from "lucide-react";

const HomePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="container">
      <header className="app-header">
        <button className="button bn-pink help-btn">?</button>
        {isModalOpen && (
          <button className="exit-button" onClick={() => setIsModalOpen(false)}>
            <LogOut size={30} />
          </button>
        )}
      </header>

      <main className="main-content">
        <div className="headline">
          <h1>Welcome to the Doodle Game!</h1>
        </div>

        <div className="button-container">
          {!isModalOpen && (
            <button className="button bn-yellow" onClick={openModal}>
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
