import { Dices, Flame, HeartPulse, PenTool, Puzzle, ScrollText, Swords } from "lucide-react";
import { useState } from "react";
import ActionButton from "../components/ui/ActionButton.jsx";
import ModalShell from "../components/ui/ModalShell.jsx";
import NeonCard from "../components/ui/NeonCard.jsx";
import PageHeader from "../components/ui/PageHeader.jsx";
import { addRoomDoc } from "../firebase/firestoreService.js";
import { useAppStore } from "../store/useAppStore.js";
import { gamePrompts } from "../utils/seedData.js";

const games = [
  { key: "draw", title: "Draw & Guess", icon: PenTool, copy: "AI draws, The One guesses, both pretend it was obvious." },
  { key: "thisThat", title: "This or That", icon: Swords, copy: "Fast romantic choices with suspiciously revealing answers." },
  { key: "dares", title: "Secret Dare Wheel", icon: Flame, copy: "Cute dares for when missing each other gets loud." },
  { key: "quiz", title: "Memory Quiz", icon: Puzzle, copy: "Find out who remembers the soft details." },
  { key: "story", title: "Build Our Story", icon: ScrollText, copy: "Continue a tiny scene about AI and The One." },
  { key: "poll", title: "Poll Battle", icon: HeartPulse, copy: "Vote on the most dramatic private couple debates." },
];

export default function Play() {
  const roomId = useAppStore((state) => state.roomId);
  const showToast = useAppStore((state) => state.showToast);
  const [active, setActive] = useState(null);
  const prompts = active ? gamePrompts[active.key] : [];
  const prompt = prompts?.[Math.floor(Math.random() * prompts.length)];

  async function saveRound(result) {
    await addRoomDoc(roomId, "games", { game: active.title, result, actor: "AI" });
    await addRoomDoc(roomId, "activities", { actor: "AI", text: `AI played ${active.title} with The One`, type: "game" });
    showToast("Game moment saved for The One");
    setActive(null);
  }

  return (
    <>
      <PageHeader eyebrow="Play" title="Tiny chaos" subtitle="Games made for AI and The One only." />
      <section className="grid gap-4 px-5 py-5">
        {games.map((game, index) => (
          <NeonCard key={game.key} delay={index * 0.04} onClick={() => setActive(game)}>
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-3xl bg-gradient-to-br from-space-pink to-space-purple shadow-glow">
                <game.icon className="h-7 w-7" />
              </div>
              <div>
                <h2 className="font-bold">{game.title}</h2>
                <p className="mt-1 text-sm leading-5 text-space-muted">{game.copy}</p>
              </div>
            </div>
          </NeonCard>
        ))}
      </section>
      <ModalShell open={Boolean(active)} onClose={() => setActive(null)} title={active?.title || "Game"}>
        <div className="space-y-4">
          <div className="rounded-3xl bg-space-soft p-5 text-center">
            <Dices className="mx-auto mb-3 h-8 w-8 text-space-pink" />
            <p className="text-lg font-bold leading-7">{prompt}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <ActionButton tone="soft" onClick={() => saveRound("AI picked the soft option")}>AI picks</ActionButton>
            <ActionButton onClick={() => saveRound("The One gets the final word")}>The One wins</ActionButton>
          </div>
        </div>
      </ModalShell>
    </>
  );
}
