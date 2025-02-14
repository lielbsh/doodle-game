import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Game from "./pages/Game";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/Game" element={<Game players={["Liel", "matan"]} />} />
      </Routes>
    </Router>
  );
};

export default App;
