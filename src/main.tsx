import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import PoliticalApp from "./PoliticalApp.tsx";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PoliticalApp />
  </StrictMode>,
);
