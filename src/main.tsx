import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BASE_URL } from "./const/app";

const ogTitle = "DreamCon";
const ogDescription = "พาความฝันของพวกเรา มาสร้างอนาคตประเทศไทยไปด้วยกัน";
const ogImage = new URL("/og.png", BASE_URL).href;
const ogUrl = new URL("", BASE_URL).href;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
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
    <main className="wv-ibmplexlooped">
      <App />
    </main>
  </StrictMode>
);
