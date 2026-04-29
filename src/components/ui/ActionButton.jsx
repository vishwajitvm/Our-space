export default function ActionButton({ children, icon: Icon, tone = "pink", className = "", ...props }) {
  const tones = {
    pink: "from-space-pink to-space-purple shadow-glow",
    blue: "from-space-blue to-space-purple shadow-blueglow",
    soft: "from-white/10 to-white/5 shadow-none border border-white/10",
  };

  return (
    <button
      className={`tap-highlight inline-flex min-h-11 items-center justify-center gap-2 rounded-3xl bg-gradient-to-r px-4 text-sm font-semibold text-white transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${tones[tone]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {children}
    </button>
  );
}
