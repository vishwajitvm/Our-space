import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "firebase-core": ["firebase/app"],
          "firebase-auth": ["firebase/auth"],
          "firebase-firestore": ["firebase/firestore"],
          "firebase-storage": ["firebase/storage"],
          vendor: ["react", "react-dom", "react-router-dom", "framer-motion", "lucide-react", "zustand"],
        },
      },
    },
  },
});
