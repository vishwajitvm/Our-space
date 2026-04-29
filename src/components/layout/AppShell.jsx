import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav.jsx";

export default function AppShell() {
  return (
    <main className="relative min-h-screen bg-space-bg pb-24">
      <Outlet />
      <BottomNav />
    </main>
  );
}
