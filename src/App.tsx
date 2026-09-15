import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import '@wevisdemo/ui/styles/index.css';
import './App.css';
import { useState } from 'react';
import CloseIcon from '@material-symbols/svg-700/rounded/close.svg?react';
import WarningIcon from '@material-symbols/svg-700/rounded/warning-fill.svg?react';
import AboutPage from './pages/About';
import AdminPage from './pages/Admin';
import AllTopic from './pages/AllTopic';
import LandingPage from './pages/Landing';
import LoginPage from './pages/Login';
import TokenExpiredPage from './pages/TokenExpired';
import Topic from './pages/Topic';
import { StoreProvider } from './store';
import { isEmulatorEnabled } from './utils/firebaseEmulator';

const isDemo = isEmulatorEnabled(import.meta.env.VITE_USE_FIREBASE_EMULATOR);

function App() {
  const [showDemoBanner, setShowDemoBanner] = useState(isDemo);

  return (
    <StoreProvider>
      <div className="flex min-h-dvh flex-col">
        <div className="flex min-h-0 flex-1 flex-col">
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
        </div>
        {showDemoBanner && (
          <p className="pointer-events-none fixed bottom-0 z-50 flex w-full items-center justify-center gap-2 bg-yellow-4 p-2 text-center text-label font-semibold text-gray-8">
            <WarningIcon className="h-4 w-4 shrink-0" aria-hidden />
            เว็บไซต์สาธิต สำหรับการทดสอบภายในเท่านั้น
            ข้อมูลทั้งหมดเป็นข้อมูลจำลองและจะไม่ถูกบันทึกถาวร
            <button
              className="pointer-events-auto absolute right-2 cursor-pointer"
              onClick={() => setShowDemoBanner(false)}
              aria-label="ปิดแถบแจ้งเตือน"
            >
              <CloseIcon className="h-4 w-4" aria-hidden />
            </button>
          </p>
        )}
      </div>
    </StoreProvider>
  );
}

export default App;
