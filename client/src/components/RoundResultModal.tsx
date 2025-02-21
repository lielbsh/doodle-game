import React from "react";
import { RoundResult } from "../models/RoundResult";

interface RoundResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  roundResult: RoundResult;
}

const RoundResultModal: React.FC<RoundResultModalProps> = ({
  isOpen,
  onClose,
  roundResult,
}) => {
  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <p>roundResult.round</p>
        <p>
          <strong>other player think you draw:</strong>{" "}
          {roundResult.guessedWord}
        </p>
        <p>
          <strong>Other player's word:</strong> {roundResult.otherPlayerWord}
        </p>
        <p>
          <strong>Correct?</strong>{" "}
          {roundResult.isCorrect ? "✅ Yes!" : "❌ No"}
        </p>
        <p>
          <strong>Current Score:</strong> {roundResult.score}
        </p>
        <button style={styles.button} onClick={onClose}>
          Continue
        </button>
      </div>
    </div>
  );
};

// CSS-in-JS styles
const styles = {
  overlay: {
    position: "fixed" as "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    transition: "transform 0.5s ease-in-out",
  },
  modal: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "90%",
    maxWidth: "400px",
    textAlign: "center" as "center",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    transform: "translateY(-100vh)", // Starts off-screen
    animation: "slideDown 0.5s forwards",
  },
  button: {
    backgroundColor: "#4285f4",
    color: "white",
    border: "none",
    padding: "10px 20px",
    fontSize: "16px",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "20px",
  },
};

// Keyframe animation (needs to be added to your global CSS or styled-components)
const styleTag = document.createElement("style");
styleTag.innerHTML = `
  @keyframes slideDown {
    from {
      transform: translateY(-100vh);
    }
    to {
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(styleTag);

export default RoundResultModal;
