import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export default function ModalShell({ open, title, children, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 mx-auto flex max-w-md items-end bg-black/60 px-3 pb-3 backdrop-blur-sm"
        >
          <motion.section
            initial={{ y: 36, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 24, scale: 0.98 }}
            className="max-h-[92vh] w-full overflow-hidden rounded-3xl border border-white/10 bg-space-card shadow-2xl shadow-black/70"
          >
            <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <h2 className="text-base font-semibold">{title}</h2>
              <button onClick={onClose} className="tap-highlight grid h-10 w-10 place-items-center rounded-full bg-white/5 text-space-muted">
                <X className="h-5 w-5" />
              </button>
            </header>
            <div className="max-h-[calc(92vh-64px)] overflow-y-auto p-4">{children}</div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
