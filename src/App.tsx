import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "@wevisdemo/ui/styles/index.css";
import "./App.css";
import Home from "./pages/Home";
import Topic from "./pages/Topic";
import { StoreProvider } from "./store";
import DefaultLayout from "./layouts/default";
import Admin from "./pages/Admin";

function App() {
  return (
    <StoreProvider>
      <Router>
        <Routes>
          {/* Route for listing all comments */}
          <Route
            path="/"
            element={
              <DefaultLayout>
                <Home />
              </DefaultLayout>
            }
          />
          {/* Dynamic route for comment details */}
          <Route
            path="/topic/:id"
            element={
              <DefaultLayout>
                <Topic />
              </DefaultLayout>
            }
          />
          <Route
            path="/admin"
            element={
              <DefaultLayout>
                <Admin />
              </DefaultLayout>
            }
          />
        </Routes>
      </Router>
    </StoreProvider>
  );
}

export default App;
