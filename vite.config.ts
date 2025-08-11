import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import electron from "vite-plugin-electron"
import renderer from "vite-plugin-electron-renderer"

export default defineConfig({
  plugins: [
    react(),
    electron([
      {
        entry: "src/main.ts",
        onstart(options) {
          options.startup()
        },
        vite: {
          build: {
            sourcemap: true,
            minify: false,
            outDir: "dist-electron",
            rollupOptions: {
              external: Object.keys("dependencies" in {} ? {} : {}),
            },
          },
        },
      },
      {
        entry: "src/preload.ts",
        onstart(options) {
          options.reload()
        },
        vite: {
          build: {
            sourcemap: "inline",
            minify: false,
            outDir: "dist-electron",
            rollupOptions: {
              external: Object.keys("dependencies" in {} ? {} : {}),
            },
          },
        },
      },
    ]),
    renderer(),
  ],
  base: "./",
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          monaco: ["monaco-editor"],
        },
      },
    },
  },
  optimizeDeps: {
    include: ["monaco-editor"],
  },
})
