import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "@wevisdemo/ui/styles/index.css";
import "./App.css";
import Home from "./pages/Home";
import Topic from "./pages/Topic";
import { StoreProvider } from "./store";

function App() {
  return (
    <StoreProvider>
      <Router>
        <Routes>
          {/* Route for listing all comments */}
          <Route path="/" element={<Home />} />
          {/* Dynamic route for comment details */}
          <Route path="/topic/:id" element={<Topic />} />
        </Routes>
      </Router>
    </StoreProvider>
  );
}

export default App;
