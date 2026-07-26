import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Widget from "./widget";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Widget />
  </StrictMode>
);
