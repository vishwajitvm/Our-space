import { motion } from "framer-motion";

export default function PageHeader({ eyebrow, title, subtitle, action }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-20 border-b border-white/5 bg-space-bg/80 px-5 pb-4 pt-[calc(env(safe-area-inset-top)+18px)] backdrop-blur-2xl"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          {eyebrow && <p className="text-xs font-medium uppercase tracking-[0.24em] text-space-pink">{eyebrow}</p>}
          <h1 className="mt-1 truncate text-2xl font-bold tracking-normal">{title}</h1>
          {subtitle && <p className="mt-1 text-sm leading-5 text-space-muted">{subtitle}</p>}
        </div>
        {action}
      </div>
    </motion.header>
  );
}
