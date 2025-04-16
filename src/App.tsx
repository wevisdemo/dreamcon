import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "@wevisdemo/ui/styles/index.css";
import "./App.css";
import Home from "./pages/Home";
import Topic from "./pages/Topic";
import { StoreProvider } from "./store";
import DefaultLayout from "./layouts/default";
import AdminPage from "./pages/Admin";
import LoginPage from "./pages/Login";
import UserHome from "./layouts/UserHome";

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
            path="/admin/login"
            element={
              <DefaultLayout>
                <LoginPage />
              </DefaultLayout>
            }
          />
          <Route
            path="/admin"
            element={
              <DefaultLayout>
                <AdminPage />
              </DefaultLayout>
            }
          />
          <Route
            path="/user-home"
            element={<UserHome>{/* <div /> */}</UserHome>}
          />
        </Routes>
      </Router>
    </StoreProvider>
  );
}

export default App;
