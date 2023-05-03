import "./App.css";
import { AppBridge } from "./PhaserApp/AppBridge";
import Footer from "./components/Footer";
import Header from "./components/Header";

function App() {
  return (
    <div id="App" className="App">
      <Header />
      <AppBridge width={896} height={992} />
      <Footer />
    </div>
  );
}

export default App;
