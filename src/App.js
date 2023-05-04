import "./App.css";
import { AppBridge } from "./PhaserApp/AppBridge";
import About from "./components/About";
import Footer from "./components/Footer";
import Header from "./components/Header";
import HighScoreBoard from "./components/HighScoreBoard";
import ScoreBoard from "./components/ScoreBoard";

function App() {
  return (
    <div id="App" className="App">
      <Header />
      <AppBridge width={896} height={992} />
      <HighScoreBoard />
      <ScoreBoard />
      <About />
      <Footer />
    </div>
  );
}

export default App;
