import "./App.css";
import { AppBridge } from "./PhaserApp/AppBridge";
import About from "./components/About";
import Footer from "./components/Footer";
import Header from "./components/Header";
import ScoreBoard from "./components/ScoreBoard";

function App() {
  return (
    <div id="App" className="App">
      <Header />
      <AppBridge width={896} height={992} />
      <ScoreBoard />
      <About />
      <Footer />
    </div>
  );
}

export default App;
