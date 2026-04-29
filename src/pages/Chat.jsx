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

export default function Chat() {
  const roomId = useAppStore((state) => state.roomId);
  const showToast = useAppStore((state) => state.showToast);
  const { items: messages } = useRoomCollection("messages");
  const fileRef = useRef(null);
  const [plusOpen, setPlusOpen] = useState(false);
  const [drawOpen, setDrawOpen] = useState(false);
  const [inputMode, setInputMode] = useState(null);

  async function send(type, payload = {}) {
    await addRoomDoc(roomId, "messages", { sender: "AI", type, ...payload });
  }

  async function sendText(text) {
    await send("text", { text });
  }

  async function quick(type) {
    if (type === "gif") return send("gif", { text: "The One sent a kiss" });
    if (type === "sticker") return send("sticker", { sticker: "AI sent you a doodle-heart sticker" });
    if (type === "voice") return send("voice", { duration: "0:14", text: "AI misses you badly" });
    if (type === "image") fileRef.current?.click();
  }

  async function sendDoodle(dataUrl) {
    const url = await uploadDataUrl(roomId, "doodles", dataUrl);
    await send("doodle", { url, text: "AI sent you a doodle" });
  }

  async function uploadImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = await uploadFile(roomId, "chat-images", file);
    await send("image", { url, text: "AI shared a little piece of today" });
    event.target.value = "";
  }

  function handlePlusPick(key) {
    if (key === "image") return fileRef.current?.click();
    if (key === "poll") return setInputMode("poll");
    if (key === "hidden") return setInputMode("hidden");
    if (key === "scheduled") {
      send("text", { text: "Scheduled for later: good night, The One. Dream of us." });
      showToast("Scheduled message saved as a soft reminder.");
    }
  }

  async function submitInput(value) {
    if (inputMode === "hidden") await send("hidden", { text: value, revealedBy: [] });
    if (inputMode === "poll") await send("poll", { question: value, options: ["AI chooses", "The One chooses"], votes: {} });
  }

  async function vote(message, option) {
    await updateMessage(roomId, message.id, { votes: { ...(message.votes || {}), AI: option } });
  }

  return (
    <>
      <PageHeader
        title="The One"
        subtitle="online now"
        action={<CoupleAvatar label="The One" online size="sm" />}
      />
      <section className="flex min-h-[calc(100vh-160px)] flex-col-reverse gap-3 px-4 pb-40 pt-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} onVote={vote} />
        ))}
      </section>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={uploadImage} />
      <ChatComposer onSend={sendText} onOpenPlus={() => setPlusOpen(true)} onDraw={() => setDrawOpen(true)} onQuick={quick} />
      <PlusModal open={plusOpen} onClose={() => setPlusOpen(false)} onPick={handlePlusPick} />
      <DoodleModal open={drawOpen} onClose={() => setDrawOpen(false)} onSend={sendDoodle} />
      <InputModal
        open={Boolean(inputMode)}
        onClose={() => setInputMode(null)}
        onSubmit={submitInput}
        title={inputMode === "poll" ? "Create a tiny poll" : "Hide a secret"}
        label={inputMode === "poll" ? "Ask The One something" : "Secret message"}
        placeholder={inputMode === "poll" ? "Who is more dramatic today?" : "Write what only The One should reveal"}
        multiline={inputMode === "hidden"}
      />
      <button className="sr-only" onClick={() => fileRef.current?.click()}><ImagePlus /> Upload</button>
    </>
  );
}
