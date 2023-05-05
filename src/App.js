import "./App.css";
import { AppBridge } from "./PhaserApp/AppBridge";
import About from "./components/About";
import Footer from "./components/Footer";
import Header from "./components/Header";
import HighScoreBoard from "./components/HighScoreBoard";
import ScoreBoard from "./components/ScoreBoard";
import Scores from "./components/Scores";

function App() {
  return (
    <div id="App" className="App">
      <Header />
      <AppBridge width={1350} height={750} />
      <HighScoreBoard />
      <ScoreBoard />
      <About />
      <Footer />
    </div>
  );
}

export default App;
