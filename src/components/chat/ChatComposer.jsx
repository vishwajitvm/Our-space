import { ImagePlus, Mic, Paintbrush, Plus, Send, Smile, WandSparkles } from "lucide-react";
import { useState } from "react";

export default function ChatComposer({ onSend, onOpenPlus, onDraw, onQuick }) {
  const [text, setText] = useState("");

  function submit(event) {
    event.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  }

  return (
    <form onSubmit={submit} className="fixed inset-x-0 bottom-[73px] z-30 mx-auto max-w-md border-t border-white/10 bg-space-card/95 px-3 py-3 backdrop-blur-2xl">
      <div className="flex items-center gap-2 rounded-3xl bg-space-soft p-2">
        <button type="button" onClick={onOpenPlus} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10 text-space-pink">
          <Plus className="h-5 w-5" />
        </button>
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="type something for The One..."
          className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-space-muted"
        />
        <button type="button" onClick={() => onQuick("gif")} className="grid h-9 w-9 place-items-center rounded-full text-space-muted">
          <WandSparkles className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => onQuick("sticker")} className="grid h-9 w-9 place-items-center rounded-full text-space-muted">
          <Smile className="h-4 w-4" />
        </button>
        <button type="button" onClick={onDraw} className="grid h-9 w-9 place-items-center rounded-full text-space-muted">
          <Paintbrush className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => onQuick("voice")} className="grid h-9 w-9 place-items-center rounded-full text-space-muted">
          <Mic className="h-4 w-4" />
        </button>
        <button type="submit" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-space-pink text-white shadow-glow">
          <Send className="h-4 w-4" />
        </button>
      </div>
      <button type="button" onClick={() => onQuick("image")} className="sr-only">
        <ImagePlus /> upload image
      </button>
    </form>
  );
}
