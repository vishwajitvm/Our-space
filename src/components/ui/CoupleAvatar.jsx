export default function CoupleAvatar({ label = "AI", online = false, size = "md" }) {
  const sizes = {
    sm: "h-9 w-9 text-sm",
    md: "h-12 w-12 text-base",
    lg: "h-16 w-16 text-xl",
  };

  return (
    <div className="relative">
      <div className={`${sizes[size]} grid place-items-center rounded-3xl bg-gradient-to-br from-space-pink via-space-purple to-space-blue font-bold shadow-glow`}>
        {label.slice(0, 1)}
      </div>
      {online && <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-space-card bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,.8)]" />}
    </div>
  );
}
