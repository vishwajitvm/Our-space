import { AnimatePresence, motion } from "framer-motion";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import AppShell from "./components/layout/AppShell.jsx";
import ToastHost from "./components/ui/ToastHost.jsx";
import Home from "./pages/Home.jsx";
import Chat from "./pages/Chat.jsx";
import Room from "./pages/Room.jsx";
import Play from "./pages/Play.jsx";
import Memories from "./pages/Memories.jsx";
import More from "./pages/More.jsx";
import Onboarding from "./pages/Onboarding.jsx";
import { useAnonymousAuth } from "./hooks/useAnonymousAuth.js";
import { useAppStore } from "./store/useAppStore.js";

export default function App() {
  useAnonymousAuth();
  const location = useLocation();
  const roomId = useAppStore((state) => state.roomId);

  return (
    <div className="min-h-screen bg-space-bg bg-soft-radial text-white">
      <div className="mx-auto min-h-screen max-w-md overflow-hidden shadow-2xl shadow-black/50">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="min-h-screen"
          >
            <Routes location={location}>
              <Route path="/join" element={<Onboarding />} />
              <Route element={roomId ? <AppShell /> : <Navigate to="/join" replace />}>
                <Route path="/" element={<Home />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/room" element={<Room />} />
                <Route path="/play" element={<Play />} />
                <Route path="/memories" element={<Memories />} />
                <Route path="/more" element={<More />} />
              </Route>
              <Route path="*" element={<Navigate to={roomId ? "/" : "/join"} replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>
      <ToastHost />
    </div>
  );
}
