import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initDatabase } from "@/lib/db";
import { initializeProtection } from "@/lib/hmr-protection";
import CustomErrorBoundary from "@/components/ErrorBoundary";

// Load protection tests in development
if (import.meta.env.DEV) {
  import("@/lib/protection-tests");
}

// Initialize protection mechanisms FIRST
initializeProtection();

console.log("[MAIN] Starting app initialization...");

// Initialize database in the background (don't block render)
console.log("[MAIN] Initializing database...");
initDatabase()
  .then(() => {
    console.log("[MAIN] Database initialized successfully");
    // Load dashboard data after database is ready
    import("@/features/dashboard/store/dashboard-store")
      .then((mod) => {
        mod.useDashboardStore.getState().loadDecisions();
        console.log("[MAIN] Dashboard data loaded");
      })
      .catch((error) => {
        console.error("[MAIN] Failed to load dashboard data:", error);
      });
  })
  .catch((error) => {
    console.error("[MAIN] Failed to initialize database:", error);
    // Don't crash the app on database init failure
  });

// Render app immediately with ErrorBoundary
console.log("[MAIN] Rendering React app...");
const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("[MAIN] Root element not found!");
  document.body.innerHTML = '<div style="padding:20px;font-family:sans-serif;"><h1>⚠️ Council Error</h1><p>Root element not found. Please refresh the page.</p></div>';
} else {
  createRoot(rootElement).render(
    <CustomErrorBoundary>
      <App />
    </CustomErrorBoundary>
  );
  console.log("[MAIN] React app rendered successfully");
}
