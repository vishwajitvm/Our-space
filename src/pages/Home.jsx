import { Flame, Gift, Heart, Moon, Radio, Send, SmilePlus } from "lucide-react";
import ActionButton from "../components/ui/ActionButton.jsx";
import CoupleAvatar from "../components/ui/CoupleAvatar.jsx";
import NeonCard from "../components/ui/NeonCard.jsx";
import PageHeader from "../components/ui/PageHeader.jsx";
import { addRoomDoc, setRoomState } from "../firebase/firestoreService.js";
import { useRoomCollection } from "../hooks/useRoomCollection.js";
import { useRoomState } from "../hooks/useRoomState.js";
import { useAppStore } from "../store/useAppStore.js";
import { nextAnniversary, relationshipDays } from "../utils/date.js";
import { dailyMissions, moods } from "../utils/seedData.js";

const quicks = [
  { label: "Hug", icon: Heart },
  { label: "Kiss", icon: SmilePlus },
  { label: "Miss You", icon: Moon },
  { label: "Poke", icon: Send },
  { label: "Angry at You", icon: Flame },
];

export default function Home() {
  const roomId = useAppStore((state) => state.roomId);
  const showToast = useAppStore((state) => state.showToast);
  const { roomState } = useRoomState();
  const { items: activities } = useRoomCollection("activities");
  const anniversary = nextAnniversary();
  const mission = dailyMissions[new Date().getDate() % dailyMissions.length];

  async function sendQuick(label) {
    const text = label === "Angry at You" ? "AI is angry but cute" : `AI sent The One a ${label.toLowerCase()}`;
    await addRoomDoc(roomId, "activities", { actor: "AI", text, type: "quick" });
    showToast(`${label} sent to The One`);
  }

  async function setMood(mood) {
    await setRoomState(roomId, { mood, lastAction: `AI feels ${mood}` });
    await addRoomDoc(roomId, "moods", { actor: "AI", mood });
  }

  return (
    <>
      <PageHeader eyebrow="Our Space" title="Hi AI" subtitle="The One has a place waiting for you." />
      <section className="space-y-4 px-5 py-5">
        <NeonCard className="relative overflow-hidden" delay={0.02}>
          <div className="flex items-center gap-4">
            <CoupleAvatar label="The One" online={roomState.partnerOnline} size="lg" />
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 text-lg font-bold">
                <Radio className="h-4 w-4 text-emerald-300" /> The One is online
              </p>
              <p className="mt-1 text-sm text-space-muted">Vandna is close enough for a soft notification.</p>
            </div>
          </div>
        </NeonCard>

        <div className="grid grid-cols-2 gap-3">
          <NeonCard delay={0.06} className="shadow-purpleglow">
            <p className="text-xs text-space-muted">Together for</p>
            <p className="mt-2 text-3xl font-black">{relationshipDays()}</p>
            <p className="text-xs text-space-pink">relationship days</p>
          </NeonCard>
          <NeonCard delay={0.09} className="shadow-blueglow">
            <p className="text-xs text-space-muted">Next anniversary</p>
            <p className="mt-2 text-3xl font-black">{anniversary.days}</p>
            <p className="text-xs text-space-blue">days left</p>
          </NeonCard>
        </div>

        <NeonCard delay={0.12}>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold">Current mood board</h2>
            <span className="rounded-full bg-space-pink/15 px-3 py-1 text-xs text-space-pink">{roomState.mood}</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {moods.map((mood) => (
              <button key={mood} onClick={() => setMood(mood)} className="shrink-0 rounded-3xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/90">
                {mood}
              </button>
            ))}
          </div>
        </NeonCard>

        <NeonCard delay={0.15}>
          <h2 className="mb-3 font-bold">Quick love sends</h2>
          <div className="grid grid-cols-2 gap-2">
            {quicks.map(({ label, icon }) => (
              <ActionButton key={label} tone="soft" icon={icon} onClick={() => sendQuick(label)} className="justify-start">
                {label}
              </ActionButton>
            ))}
          </div>
        </NeonCard>

        <NeonCard delay={0.18} className="bg-gradient-to-br from-space-card to-space-soft">
          <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-space-pink"><Gift className="h-4 w-4" /> Daily surprise mission</p>
          <p className="text-lg font-bold leading-7">{mission}</p>
        </NeonCard>

        <NeonCard delay={0.2}>
          <h2 className="mb-3 font-bold">Latest activity</h2>
          <div className="space-y-3">
            {activities.slice(0, 5).map((activity) => (
              <div key={activity.id} className="rounded-3xl bg-white/5 px-4 py-3 text-sm text-white/90">
                {activity.text}
              </div>
            ))}
          </div>
        </NeonCard>
      </section>
    </>
  );
}
