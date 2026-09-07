import "@acalyle/ui/dist/style.css";
import "virtual:uno.css";

import { globalStyle } from "asarina";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "~/app/app";

globalStyle(":root, body, #app", {
  height: "100%",
});

const appEl = document.getElementById("app");
if (appEl != null) {
  createRoot(appEl).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
