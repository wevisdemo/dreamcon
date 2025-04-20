import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "@wevisdemo/ui/styles/index.css";
import "./App.css";
import AllTopic from "./pages/AllTopic";
import Topic from "./pages/Topic";
import { StoreProvider } from "./store";
import AdminPage from "./pages/Admin";
import LoginPage from "./pages/Login";
import LandingPage from "./pages/Landing";
import AboutPage from "./pages/About";
import { BASE_URL } from "./const/app";

const ogTitle = "DreamCon";
const ogDescription = "พาความฝันของพวกเรา มาสร้างอนาคตประเทศไทยไปด้วยกัน";
const ogImage = new URL("/og.png", BASE_URL).href;
const ogUrl = new URL("/", BASE_URL).href;

function App() {
  return (
    <>
      <title>{ogTitle}</title>
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={ogUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle} />
      <meta name="twitter:description" content={ogDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={ogTitle} />
      <meta name="twitter:url" content={ogUrl} />
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
          </Routes>
        </Router>
      </StoreProvider>
    </>
  );
}

export default App;
