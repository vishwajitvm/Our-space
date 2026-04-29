import { Camera, Cat, Gift, ImagePlus, Paintbrush, StickyNote } from "lucide-react";
import { useRef, useState } from "react";
import ActionButton from "../components/ui/ActionButton.jsx";
import NeonCard from "../components/ui/NeonCard.jsx";
import PageHeader from "../components/ui/PageHeader.jsx";
import InputModal from "../modals/InputModal.jsx";
import DoodleModal from "../modals/DoodleModal.jsx";
import { addRoomDoc, setRoomState } from "../firebase/firestoreService.js";
import { uploadDataUrl, uploadFile } from "../firebase/storageService.js";
import { useRoomState } from "../hooks/useRoomState.js";
import { useAppStore } from "../store/useAppStore.js";

export default function Room() {
  const roomId = useAppStore((state) => state.roomId);
  const showToast = useAppStore((state) => state.showToast);
  const { roomState } = useRoomState();
  const fileRef = useRef(null);
  const [target, setTarget] = useState("photo");
  const [input, setInput] = useState(null);
  const [drawOpen, setDrawOpen] = useState(false);

  async function upload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = await uploadFile(roomId, target === "wall" ? "wall" : "room-photo", file);
    await setRoomState(roomId, target === "wall" ? { wallDoodleUrl: url, lastAction: "AI pinned a wall doodle" } : { photoUrl: url, lastAction: "AI changed the photo frame" });
    await addRoomDoc(roomId, "activities", { actor: "AI", text: target === "wall" ? "AI pinned a wall doodle" : "AI uploaded a room photo", type: "room" });
    event.target.value = "";
  }

  async function feedPet() {
    const count = (roomState.petFedCount || 0) + 1;
    await setRoomState(roomId, { petFedCount: count, lastAction: "AI fed the pet" });
    await addRoomDoc(roomId, "activities", { actor: "AI", text: "AI fed the pet", type: "room" });
  }

  async function saveInput(value) {
    const patch = input === "note" ? { note: value, lastAction: "AI left a note for The One" } : { gift: value, lastAction: "AI dropped a gift message" };
    await setRoomState(roomId, patch);
    await addRoomDoc(roomId, "activities", { actor: "AI", text: patch.lastAction, type: "room" });
  }

  async function sendWallDoodle(dataUrl) {
    const url = await uploadDataUrl(roomId, "wall-doodles", dataUrl);
    await setRoomState(roomId, { wallDoodleUrl: url, lastAction: "AI pinned a doodle for The One" });
    showToast("Wall doodle pinned for The One");
  }

  return (
    <>
      <PageHeader eyebrow="Shared room" title="Cozy corner" subtitle={roomState.lastAction || "The One is nearby."} />
      <section className="space-y-4 px-5 py-5">
        <div className="relative h-[520px] overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,#17171f_0%,#1d1d27_58%,#111118_100%)] p-4 shadow-purpleglow">
          <div className="absolute left-8 top-6 h-24 w-28 rounded-3xl border border-space-pink/40 bg-black/25 p-2 shadow-glow">
            {roomState.photoUrl ? <img src={roomState.photoUrl} alt="Couple frame" className="h-full w-full rounded-2xl object-cover" /> : <Camera className="mx-auto mt-6 h-8 w-8 text-space-pink" />}
            <button onClick={() => { setTarget("photo"); fileRef.current?.click(); }} className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-space-pink px-3 py-1 text-[10px] font-bold">
              Photo Frame
            </button>
          </div>

          <button onClick={() => setInput("note")} className="absolute right-5 top-24 w-36 rounded-3xl border border-yellow-200/20 bg-yellow-300/15 p-4 text-left shadow-lg">
            <StickyNote className="mb-2 h-5 w-5 text-yellow-200" />
            <p className="text-xs font-bold text-yellow-100">Note for The One</p>
            <p className="mt-1 line-clamp-3 text-xs text-white/80">{roomState.note}</p>
          </button>

          <button onClick={feedPet} className="absolute bottom-24 left-7 rounded-[2rem] border border-white/10 bg-space-card p-4 text-center shadow-blueglow">
            <Cat className="mx-auto h-12 w-12 text-space-blue" />
            <p className="mt-2 text-sm font-bold">Shared Pet</p>
            <p className="text-xs text-space-muted">fed {roomState.petFedCount || 0} times</p>
          </button>

          <button onClick={() => setInput("gift")} className="absolute bottom-36 right-6 w-36 rounded-3xl border border-space-pink/20 bg-space-card p-4 text-left shadow-glow">
            <Gift className="mb-2 h-6 w-6 text-space-pink" />
            <p className="text-xs font-bold">Gift Shelf</p>
            <p className="mt-1 line-clamp-3 text-xs text-space-muted">{roomState.gift}</p>
          </button>

          <button onClick={() => { setTarget("wall"); fileRef.current?.click(); }} className="absolute bottom-8 right-8 h-24 w-40 rounded-3xl border border-space-blue/30 bg-black/20 p-2 text-center">
            {roomState.wallDoodleUrl ? <img src={roomState.wallDoodleUrl} alt="Wall doodle" className="h-full w-full rounded-2xl object-cover" /> : <Paintbrush className="mx-auto mt-4 h-8 w-8 text-space-blue" />}
            <span className="absolute -top-3 left-4 rounded-full bg-space-blue px-3 py-1 text-[10px] font-bold">Wall Doodle</span>
          </button>

          <div className="absolute inset-x-8 bottom-0 h-16 rounded-t-[50%] bg-black/25" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <ActionButton icon={ImagePlus} tone="soft" onClick={() => { setTarget("photo"); fileRef.current?.click(); }}>Upload photo</ActionButton>
          <ActionButton icon={Paintbrush} onClick={() => setDrawOpen(true)}>Draw wall</ActionButton>
        </div>

        <NeonCard>
          <p className="text-sm text-space-muted">Room pulse</p>
          <p className="mt-2 text-lg font-bold">{roomState.lastAction || "AI and The One are keeping this room warm."}</p>
        </NeonCard>
      </section>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={upload} />
      <InputModal
        open={Boolean(input)}
        onClose={() => setInput(null)}
        onSubmit={saveInput}
        title={input === "note" ? "Sticky Note Desk" : "Gift Shelf"}
        label={input === "note" ? "Leave a note for The One" : "Drop a cute gift message"}
        placeholder={input === "note" ? "The One, drink water and miss AI." : "A tiny gift, a promise, a dare..."}
        multiline
      />
      <DoodleModal open={drawOpen} onClose={() => setDrawOpen(false)} onSend={sendWallDoodle} title="Pin a wall doodle" />
    </>
  );
}
