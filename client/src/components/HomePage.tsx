import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NameEntryModal from "../components/NameEntry";
import "../styles/HomePage.css";
import { LogOut, X } from "lucide-react";
import { playSound } from "../utils/soundUtils";

const HomePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  const openModal = () => {
    playSound("click");
    setIsModalOpen(true);
  };

  const toggleInfoModal = () => {
    playSound("click");
    setIsHelpModalOpen(!isHelpModalOpen);
  };

  return (
    <div className="container">
      <header className="app-header">
        <button className="button bn-pink help-btn" onClick={toggleInfoModal}>
          ?
        </button>
        {isModalOpen && (
          <button
            className="exit-button"
            onClick={() => {
              setIsModalOpen(false);
              playSound("click");
            }}
          >
            <LogOut size={30} />
          </button>
        )}
      </header>

      {isHelpModalOpen && (
        <div className="help-modal">
          <div className="help-content">
            <h2>Here’s how the game works</h2>
            <p> Two players draw at the same time based on a word they get.</p>
            <p> When time runs out, guess the other player’s drawing.</p>
            <p> Earn 1 point for each correct guess.</p>
            <p> There are 3 rounds — work together for the highest score.</p>
            <button onClick={toggleInfoModal} className="close-btn">
              Got it!
            </button>
          </div>
        </div>
      )}

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
