import { useRef, useState } from "react";
import { ImagePlus } from "lucide-react";
import ChatComposer from "../components/chat/ChatComposer.jsx";
import MessageBubble from "../components/chat/MessageBubble.jsx";
import CoupleAvatar from "../components/ui/CoupleAvatar.jsx";
import PageHeader from "../components/ui/PageHeader.jsx";
import PlusModal from "../modals/PlusModal.jsx";
import DoodleModal from "../modals/DoodleModal.jsx";
import InputModal from "../modals/InputModal.jsx";
import { addRoomDoc, updateMessage } from "../firebase/firestoreService.js";
import { uploadDataUrl, uploadFile } from "../firebase/storageService.js";
import { useRoomCollection } from "../hooks/useRoomCollection.js";
import { useAppStore } from "../store/useAppStore.js";
import { partnerFor } from "../utils/couple.js";

export default function Chat() {
  const roomId = useAppStore((state) => state.roomId);
  const persona = useAppStore((state) => state.persona);
  const showToast = useAppStore((state) => state.showToast);
  const { items: messages } = useRoomCollection("messages");
  const fileRef = useRef(null);
  const [plusOpen, setPlusOpen] = useState(false);
  const [drawOpen, setDrawOpen] = useState(false);
  const [inputMode, setInputMode] = useState(null);

  const partner = partnerFor(persona);

  async function send(type, payload = {}) {
    try {
      await addRoomDoc(roomId, "messages", { sender: persona, type, ...payload });
    } catch (error) {
      showToast(error.message, "blue");
    }
  }

  async function sendText(text) {
    await send("text", { text });
  }

  async function quick(type) {
    if (type === "gif") return send("gif", { text: "The One sent a kiss" });
    if (type === "sticker") return send("sticker", { sticker: `${persona} sent you a doodle-heart sticker` });
    if (type === "voice") return send("voice", { duration: "0:14", text: `${persona} misses you badly` });
    if (type === "image") fileRef.current?.click();
  }

  async function sendDoodle(dataUrl) {
    const url = await uploadDataUrl(roomId, "doodles", dataUrl);
    await send("doodle", { url, text: `${persona} sent you a doodle` });
  }

  async function uploadImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = await uploadFile(roomId, "chat-images", file);
    await send("image", { url, text: `${persona} shared a little piece of today` });
    event.target.value = "";
  }

  function handlePlusPick(key) {
    if (key === "image") return fileRef.current?.click();
    if (key === "poll") return setInputMode("poll");
    if (key === "hidden") return setInputMode("hidden");
    if (key === "scheduled") {
      send("text", { text: `Scheduled for later: good night, ${partner}. Dream of us.` });
      showToast("Scheduled message saved as a soft reminder.");
    }
  }

  async function submitInput(value) {
    if (inputMode === "hidden") await send("hidden", { text: value, revealedBy: [] });
    if (inputMode === "poll") await send("poll", { question: value, options: ["AI chooses", "The One chooses"], votes: {} });
  }

  async function vote(message, option) {
    try {
      await updateMessage(roomId, message.id, { votes: { ...(message.votes || {}), [persona]: option } });
    } catch (error) {
      showToast(error.message, "blue");
    }
  }

  return (
    <>
      <PageHeader
        title={partner}
        subtitle="online now"
        action={<CoupleAvatar label={partner} online size="sm" />}
      />
      <section className="flex min-h-[calc(100vh-160px)] flex-col-reverse gap-3 px-4 pb-40 pt-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} onVote={vote} />
        ))}
      </section>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={uploadImage} />
      <ChatComposer partner={partner} onSend={sendText} onOpenPlus={() => setPlusOpen(true)} onDraw={() => setDrawOpen(true)} onQuick={quick} />
      <PlusModal open={plusOpen} onClose={() => setPlusOpen(false)} onPick={handlePlusPick} />
      <DoodleModal open={drawOpen} onClose={() => setDrawOpen(false)} onSend={sendDoodle} />
      <InputModal
        open={Boolean(inputMode)}
        onClose={() => setInputMode(null)}
        onSubmit={submitInput}
        title={inputMode === "poll" ? "Create a tiny poll" : "Hide a secret"}
        label={inputMode === "poll" ? "Ask The One something" : "Secret message"}
        placeholder={inputMode === "poll" ? "Who is more dramatic today?" : `Write what only ${partner} should reveal`}
        multiline={inputMode === "hidden"}
      />
      <button className="sr-only" onClick={() => fileRef.current?.click()}><ImagePlus /> Upload</button>
    </>
  );
}
