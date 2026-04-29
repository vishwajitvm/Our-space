import { Check, LogOut, MoonStar, Plus, Settings, Sparkles, Target } from "lucide-react";
import { useState } from "react";
import ActionButton from "../components/ui/ActionButton.jsx";
import ModalShell from "../components/ui/ModalShell.jsx";
import NeonCard from "../components/ui/NeonCard.jsx";
import PageHeader from "../components/ui/PageHeader.jsx";
import InputModal from "../modals/InputModal.jsx";
import { addRoomDoc } from "../firebase/firestoreService.js";
import { useRoomCollection } from "../hooks/useRoomCollection.js";
import { useAppStore } from "../store/useAppStore.js";

const questions = [
  "What did The One do that made AI feel chosen lately?",
  "What should Visshwa hear from Vandna before sleeping?",
  "Where should your future late-night walk happen?",
  "What tiny habit of The One secretly melts AI?",
];

const futurePlans = ["Build a Sunday ritual", "Plan a Goa sunset day", "Save for a cozy room makeover", "Make a private playlist"];

export default function More() {
  const roomId = useAppStore((state) => state.roomId);
  const persona = useAppStore((state) => state.persona);
  const leaveRoom = useAppStore((state) => state.leaveRoom);
  const showToast = useAppStore((state) => state.showToast);
  const { items: letters } = useRoomCollection("letters");
  const { items: bucket } = useRoomCollection("bucketlist");
  const [activeLetter, setActiveLetter] = useState(null);
  const [bucketOpen, setBucketOpen] = useState(false);
  const todayQuestion = questions[new Date().getDate() % questions.length];

  async function addBucket(value) {
    try {
      await addRoomDoc(roomId, "bucketlist", { text: value, done: false, actor: persona });
      showToast("Bucket list promise added");
    } catch (error) {
      showToast(error.message, "blue");
    }
  }

  return (
    <>
      <PageHeader eyebrow="More" title="Deeper things" subtitle="Letters, questions, plans, and private settings." />
      <section className="space-y-5 px-5 py-5">
        <NeonCard>
          <h2 className="mb-3 flex items-center gap-2 font-bold"><MoonStar className="h-5 w-5 text-space-pink" /> Open When Letters</h2>
          <div className="space-y-2">
            {letters.map((letter) => (
              <button key={letter.id} onClick={() => setActiveLetter(letter)} className="tap-highlight w-full rounded-3xl bg-white/5 px-4 py-3 text-left text-sm">
                {letter.title}
              </button>
            ))}
          </div>
        </NeonCard>

        <NeonCard>
          <h2 className="mb-2 flex items-center gap-2 font-bold"><Sparkles className="h-5 w-5 text-space-blue" /> Deep Daily Question</h2>
          <p className="text-lg font-bold leading-7">{todayQuestion}</p>
          <p className="mt-2 text-sm text-space-muted">Answer honestly. AI and The One can handle soft truth.</p>
        </NeonCard>

        <NeonCard>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-bold"><Target className="h-5 w-5 text-space-pink" /> Shared Bucket List</h2>
            <button onClick={() => setBucketOpen(true)} className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-space-pink">
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-2">
            {bucket.map((item) => (
              <div key={item.id} className="flex items-center gap-3 rounded-3xl bg-white/5 px-4 py-3 text-sm">
                <span className={`grid h-6 w-6 place-items-center rounded-full ${item.done ? "bg-space-pink" : "border border-white/20"}`}>{item.done && <Check className="h-4 w-4" />}</span>
                <span className={item.done ? "text-white/60 line-through" : ""}>{item.text}</span>
              </div>
            ))}
          </div>
        </NeonCard>

        <NeonCard>
          <h2 className="mb-3 font-bold">Future Plans</h2>
          <div className="grid gap-2">
            {futurePlans.map((plan) => (
              <div key={plan} className="rounded-3xl bg-white/5 px-4 py-3 text-sm text-white/90">{plan}</div>
            ))}
          </div>
        </NeonCard>

        <NeonCard>
          <h2 className="mb-3 flex items-center gap-2 font-bold"><Settings className="h-5 w-5 text-space-muted" /> Settings</h2>
          <div className="rounded-3xl bg-white/5 px-4 py-3 text-sm text-space-muted">
            Room ID: <span className="font-semibold text-white">{roomId}</span>
          </div>
          <ActionButton tone="soft" icon={LogOut} onClick={leaveRoom} className="mt-3 w-full justify-start">
            Leave this device
          </ActionButton>
        </NeonCard>
      </section>
      <ModalShell open={Boolean(activeLetter)} onClose={() => setActiveLetter(null)} title={activeLetter?.title || "Letter"}>
        <p className="rounded-3xl bg-space-soft p-5 text-base leading-7 text-white/90">{activeLetter?.body}</p>
      </ModalShell>
      <InputModal open={bucketOpen} onClose={() => setBucketOpen(false)} onSubmit={addBucket} title="Add bucket list promise" label="What should AI and The One do someday?" placeholder="A rainy balcony date..." />
    </>
  );
}
