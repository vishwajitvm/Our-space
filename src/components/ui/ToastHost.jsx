import { AnimatePresence, motion } from "framer-motion";
import { useAppStore } from "../../store/useAppStore.js";

export default function ToastHost() {
  const toast = useAppStore((state) => state.toast);
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed inset-x-0 bottom-24 z-[80] mx-auto max-w-md px-5"
        >
          <div className="rounded-3xl border border-white/10 bg-space-soft px-4 py-3 text-sm font-medium text-white shadow-glow">
            {toast.message}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
