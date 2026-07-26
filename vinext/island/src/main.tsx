import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import IslandCounter from "./counter";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <IslandCounter initialCount={18} renderedAt="standalone" />
  </StrictMode>
);
