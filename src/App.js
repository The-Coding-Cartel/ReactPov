import "./App.css";
import { AppBridge } from "./PhaserApp/AppBridge";

function App() {
  return (
    <div id="App" className="App">
      <AppBridge width={896} height={992} />
      <header className="App-header">POVMAN REACT</header>
    </div>
  );
}

export default App;
