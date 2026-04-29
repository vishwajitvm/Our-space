import { motion } from "framer-motion";

export default function NeonCard({ children, className = "", delay = 0, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, delay, ease: "easeOut" }}
      onClick={onClick}
      className={`glass-card rounded-3xl p-4 shadow-glow ${onClick ? "tap-highlight cursor-pointer active:scale-[0.99]" : ""} ${className}`}
    >
      {children}
    </motion.div>
  );
}
