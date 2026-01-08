import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Detect GitHub Codespaces environment
  const isCodespaces = process.env.CODESPACES === 'true';
  const codespaceName = process.env.CODESPACE_NAME;
  
  // Build the HMR configuration for Codespaces
  const hmrConfig = isCodespaces && codespaceName
    ? {
        protocol: 'wss', // Use secure WebSocket in Codespaces
        host: `${codespaceName}-8000.app.github.dev`,
        clientPort: 443, // Use standard HTTPS port
        overlay: true,
        timeout: 30000,
      }
    : {
        overlay: true,
        timeout: 30000,
        protocol: 'ws',
      };

  return {
    server: {
      host: "0.0.0.0",
      port: 8000,
      strictPort: false,
      allowedHosts: true,
      cors: true,
      middlewareMode: false,
      hmr: hmrConfig,
      watch: {
        // Reduce file watching overhead
        ignored: ['**/node_modules/**', '**/dist/**', '**/.git/**'],
      },
    },
    plugins: [react(), tsconfigPaths()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      // Better error reporting
      sourcemap: mode === 'development',
      rollupOptions: {
        onwarn(warning, warn) {
          // Suppress certain warnings
          if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return;
          warn(warning);
        },
      },
    },
    // Optimize dependency pre-bundling
    optimizeDeps: {
      include: ['react', 'react-dom', 'zustand', 'react-error-boundary'],
      exclude: ['@vite/client', '@vite/env'],
    },
  };
});
