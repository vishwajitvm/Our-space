import { Camera, Heart, ImagePlus, Paintbrush, Save } from "lucide-react";
import { useRef, useState } from "react";
import ActionButton from "../components/ui/ActionButton.jsx";
import NeonCard from "../components/ui/NeonCard.jsx";
import PageHeader from "../components/ui/PageHeader.jsx";
import DoodleModal from "../modals/DoodleModal.jsx";
import InputModal from "../modals/InputModal.jsx";
import { addRoomDoc } from "../firebase/firestoreService.js";
import { uploadDataUrl, uploadFile } from "../firebase/storageService.js";
import { useRoomCollection } from "../hooks/useRoomCollection.js";
import { useAppStore } from "../store/useAppStore.js";
import { partnerFor } from "../utils/couple.js";

export default function Memories() {
  const roomId = useAppStore((state) => state.roomId);
  const persona = useAppStore((state) => state.persona);
  const showToast = useAppStore((state) => state.showToast);
  const { items: memories } = useRoomCollection("memories");
  const fileRef = useRef(null);
  const [textOpen, setTextOpen] = useState(false);
  const [drawOpen, setDrawOpen] = useState(false);

  const partner = partnerFor(persona);

  async function upload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadFile(roomId, "memories", file);
      await addRoomDoc(roomId, "memories", { title: "A new soft proof", body: `${persona} saved this for ${partner}.`, type: "photo", url, mood: "romantic" });
      showToast("Memory saved in the vault");
      event.target.value = "";
    } catch (error) {
      showToast(error.message, "blue");
    }
  }

  async function saveText(value) {
    try {
      await addRoomDoc(roomId, "memories", { title: value.split(".")[0].slice(0, 42) || "A private memory", body: value, type: "text", mood: `saved by ${persona}` });
    } catch (error) {
      showToast(error.message, "blue");
    }
  }

  async function saveDoodle(dataUrl) {
    try {
      const url = await uploadDataUrl(roomId, "memory-doodles", dataUrl);
      await addRoomDoc(roomId, "memories", { title: `${persona}'s doodle for ${partner}`, body: "A tiny drawing from the heart archive.", type: "doodle", url, mood: "playful" });
    } catch (error) {
      showToast(error.message, "blue");
    }
  }

  async function saveChatMoment() {
    try {
      await addRoomDoc(roomId, "memories", { title: "Favorite chat moment", body: `${partner} sent a kiss and ${persona} absolutely melted.`, type: "chat", mood: "blushing" });
      showToast("Favorite chat moment saved");
    } catch (error) {
      showToast(error.message, "blue");
    }
  }

  return (
    <>
      <PageHeader eyebrow="Memory vault" title="Everything soft" subtitle="Photos, notes, doodles, and tiny proofs of love." />
      <section className="space-y-4 px-5 py-5">
        <div className="grid grid-cols-2 gap-3">
          <ActionButton icon={ImagePlus} onClick={() => fileRef.current?.click()}>Photo</ActionButton>
          <ActionButton icon={Save} tone="soft" onClick={() => setTextOpen(true)}>Text memory</ActionButton>
          <ActionButton icon={Paintbrush} tone="soft" onClick={() => setDrawOpen(true)}>Doodle</ActionButton>
          <ActionButton icon={Heart} onClick={saveChatMoment}>Chat moment</ActionButton>
        </div>
        <div className="columns-1 gap-4 space-y-4">
          {memories.map((memory, index) => (
            <NeonCard key={memory.id} delay={index * 0.03} className="break-inside-avoid">
              {memory.url && <img src={memory.url} alt={memory.title} className="mb-3 max-h-80 w-full rounded-3xl object-cover" />}
              {!memory.url && <Camera className="mb-3 h-8 w-8 text-space-pink" />}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-bold">{memory.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-space-muted">{memory.body}</p>
                </div>
                <span className="shrink-0 rounded-full bg-white/5 px-3 py-1 text-[10px] text-space-pink">{memory.mood}</span>
              </div>
            </NeonCard>
          ))}
        </div>
      </section>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={upload} />
      <InputModal open={textOpen} onClose={() => setTextOpen(false)} onSubmit={saveText} title="Save a memory" label={`What should ${persona} never forget?`} placeholder="That sleepy selfie from Vandna..." multiline />
      <DoodleModal open={drawOpen} onClose={() => setDrawOpen(false)} onSend={saveDoodle} title="Save a doodle memory" />
    </>
  );
}
