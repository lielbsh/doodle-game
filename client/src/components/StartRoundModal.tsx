import React, { useEffect, useState } from "react";

interface StartRoundModalProps {
  isOpen: boolean;
  word: string;
  round: number;
}

const StartRoundModal: React.FC<StartRoundModalProps> = ({
  isOpen,
  word,
  round,
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        ...styles.overlay,
        animation: isOpen ? "fall 0.8s ease-out" : "none",
      }}
    >
      <div style={styles.content}>
        <p>Round: {round}/3</p>
        <p>Draw</p>
        <h1>{word}</h1>
        <p>In under 15 seconds</p>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed" as "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center" as "center",
    zIndex: 1000,
  },
  content: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  button: {
    marginTop: "20px",
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#4285f4",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

// Inject CSS animation
const styleTag = document.createElement("style");
styleTag.innerHTML = `
  @keyframes fall {
    from {
      transform: translateY(-100vh);
    }
    to {
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(styleTag);

export default StartRoundModal;
