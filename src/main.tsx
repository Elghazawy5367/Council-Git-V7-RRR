import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initDatabase } from "@/lib/db";

console.log("[MAIN] Starting app initialization...");

// Initialize database in the background (don't block render)
console.log("[MAIN] Initializing database...");
initDatabase().catch((error) => {
  console.error("[MAIN] Failed to initialize database:", error);
});

// Render app immediately
console.log("[MAIN] Rendering React app...");
const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("[MAIN] Root element not found!");
} else {
  createRoot(rootElement).render(<App />);
  console.log("[MAIN] React app rendered successfully");
}
