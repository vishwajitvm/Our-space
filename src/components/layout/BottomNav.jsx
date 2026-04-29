import { Heart, Home, MessageCircle, MoreHorizontal, Play, Sparkles, Vault } from "lucide-react";
import { NavLink } from "react-router-dom";

const tabs = [
  { to: "/", label: "Home", icon: Home },
  { to: "/chat", label: "Chat", icon: MessageCircle },
  { to: "/room", label: "Room", icon: Heart },
  { to: "/play", label: "Play", icon: Play },
  { to: "/memories", label: "Memories", icon: Vault },
  { to: "/more", label: "More", icon: MoreHorizontal },
];

export default function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md border-t border-white/10 bg-space-card/95 px-2 pb-[calc(env(safe-area-inset-bottom)+8px)] pt-2 backdrop-blur-2xl">
      <div className="grid grid-cols-6 gap-1">
        {tabs.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `tap-highlight flex min-h-14 flex-col items-center justify-center gap-1 rounded-3xl text-[10px] transition ${
                isActive ? "bg-white/10 text-space-pink shadow-glow" : "text-space-muted hover:bg-white/5 hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className="h-5 w-5" strokeWidth={isActive ? 2.7 : 2.1} />
                <span className="truncate">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
      <Sparkles className="pointer-events-none absolute left-1/2 top-1 h-3 w-3 -translate-x-1/2 text-space-pink/50" />
    </nav>
  );
}
