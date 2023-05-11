import { useState } from "react";
import "./App.css";
import { AppBridge } from "./PhaserApp/AppBridge";
import About from "./components/About";
import Footer from "./components/Footer";
import Header from "./components/Header";
import HighScoreBoard from "./components/HighScoreBoard";
import ScoreBoard from "./components/ScoreBoard";
import Instruction from "./components/Instruction";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState();
  const [isLoading, setIsLoading] = useState(true);
  return (
    <div id="App" className="App">
      <Header
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        user={user}
        setUser={setUser}
      />
      {!isLoggedIn && <Instruction />}
      {isLoggedIn && (
        <div>
          {" "}
          <AppBridge width={1350} height={750} />
          <h3>Controls</h3>{" "}
          <p>
            {" "}
            The controls for the game are as follows: Use the arrow keys to move
            forward, back, left, and right. Press Q to turn left, and E to turn
            right. Hold down the Shift key to sprint.
          </p>
        </div>
      )}
      <HighScoreBoard />
      <ScoreBoard isLoading={isLoading} setIsLoading={setIsLoading} />
      <About />
      <Footer />
    </div>
  );
}

export default App;
