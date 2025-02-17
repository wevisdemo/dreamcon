import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "@wevisdemo/ui/styles/index.css";
import "./App.css";
import Home from "./pages/Home";
import Topic from "./pages/topic";

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Route for listing all comments */}
          <Route path="/" element={<Home />} />
          {/* Dynamic route for comment details */}
          <Route path="/topic/:id" element={<Topic />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
