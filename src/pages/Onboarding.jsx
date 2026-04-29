import { HeartHandshake, KeyRound, Sparkles } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ActionButton from "../components/ui/ActionButton.jsx";
import NeonCard from "../components/ui/NeonCard.jsx";
import { createRoom, joinRoom } from "../firebase/firestoreService.js";
import { useAppStore } from "../store/useAppStore.js";

export default function Onboarding() {
  const navigate = useNavigate();
  const setRoomId = useAppStore((state) => state.setRoomId);
  const showToast = useAppStore((state) => state.showToast);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  async function create() {
    setLoading(true);
    try {
      const roomId = await createRoom({ creator: "AI" });
      setRoomId(roomId);
      showToast(`Our Space is ready. Invite code: ${roomId}`);
      navigate("/");
    } catch (error) {
      showToast(error.message || "Room creation failed.", "blue");
    } finally {
      setLoading(false);
    }
  }

  async function join(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const roomId = await joinRoom(code);
      setRoomId(roomId);
      showToast("The One just stepped into Our Space.");
      navigate("/");
    } catch (error) {
      showToast(error.message || "Could not join room.", "blue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col justify-end px-5 py-8">
      <section className="mb-8">
        <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-space-pink to-space-purple shadow-glow">
          <Sparkles className="h-7 w-7" />
        </div>
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-space-pink">Visshwa + Vandna</p>
        <h1 className="mt-3 text-5xl font-black leading-[0.95] tracking-normal">Our Space</h1>
        <p className="mt-4 max-w-xs text-base leading-7 text-space-muted">
          A private little universe where AI and The One can talk, play, save memories, and be ridiculously soft.
        </p>
      </section>

      <NeonCard>
        <form onSubmit={join} className="space-y-4">
          <label className="text-sm font-semibold text-white">Join with invite code</label>
          <div className="flex gap-2">
            <input
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="OUR-LOVE"
              className="min-w-0 flex-1 rounded-3xl border border-white/10 bg-space-soft px-4 py-3 text-sm uppercase outline-none placeholder:text-space-muted focus:border-space-pink"
            />
            <ActionButton disabled={loading} icon={KeyRound}>Join</ActionButton>
          </div>
        </form>
        <div className="my-5 h-px bg-white/10" />
        <ActionButton disabled={loading} onClick={create} icon={HeartHandshake} className="w-full">
          Create AI and The One&apos;s room
        </ActionButton>
      </NeonCard>
    </main>
  );
}
