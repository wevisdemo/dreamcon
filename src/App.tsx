import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '@wevisdemo/ui/styles/index.css';
import './App.css';
import AllTopic from './pages/AllTopic';
import Topic from './pages/Topic';
import { StoreProvider } from './store';
import AdminPage from './pages/Admin';
import LoginPage from './pages/Login';
import LandingPage from './pages/Landing';
import AboutPage from './pages/About';
import TokenExpiredPage from './pages/TokenExpired';

function App() {
  return (
    <StoreProvider>
      <Router>
        <Routes>
          {/* Route for listing all comments */}
          <Route path="/topics" element={<AllTopic />} />
          {/* Dynamic route for comment details */}
          <Route path="/topics/:id" element={<Topic />} />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/token-expired" element={<TokenExpiredPage />} />
        </Routes>
      </Router>
    </StoreProvider>
  );
}

export default App;
