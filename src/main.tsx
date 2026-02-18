import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.css";
import { AppShell } from "./components/AppShell";
import { AppShellProviders } from "./providers/AppShellProviders";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppShellProviders>
      <AppShell />
    </AppShellProviders>
  </StrictMode>
);
