import { motion } from "framer-motion";
import { BarChart3, Eye, Image as ImageIcon, Mic, Sparkles } from "lucide-react";
import { useState } from "react";
import { couple } from "../../utils/couple.js";
import { timeLabel } from "../../utils/date.js";

export default function MessageBubble({ message, onVote }) {
  const mine = message.sender === couple.user.nickname;
  const [revealed, setRevealed] = useState(message.type !== "hidden");

  const bubbleClass = mine
    ? "ml-auto rounded-br-md bg-gradient-to-br from-space-pink to-space-purple"
    : "mr-auto rounded-bl-md bg-space-soft border border-white/10";

  return (
    <motion.article
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`max-w-[82%] rounded-3xl px-4 py-3 shadow-lg ${bubbleClass}`}
    >
      <p className={`mb-1 text-[11px] font-semibold ${mine ? "text-white/80" : "text-space-pink"}`}>{message.sender}</p>
      {message.type === "text" && <p className="text-sm leading-5">{message.text}</p>}
      {message.type === "image" && (
        <div className="overflow-hidden rounded-2xl bg-black/20">
          {message.url ? <img src={message.url} alt={message.text || "Shared memory"} className="max-h-72 w-full object-cover" /> : <ImageIcon className="m-8 h-10 w-10 text-white/70" />}
          {message.text && <p className="p-3 text-sm">{message.text}</p>}
        </div>
      )}
      {message.type === "gif" && <div className="rounded-2xl bg-black/20 p-4 text-sm">Sparkly GIF: {message.text || "The One sent a kiss"}</div>}
      {message.type === "sticker" && <div className="rounded-2xl bg-white/10 p-4 text-center text-lg font-bold">{message.sticker}</div>}
      {message.type === "doodle" && <img src={message.url} alt="Doodle message" className="max-h-72 rounded-2xl bg-white" />}
      {message.type === "hidden" && (
        <button onClick={() => setRevealed(true)} className="tap-highlight w-full text-left">
          <div className={`rounded-2xl border border-white/10 p-3 transition ${revealed ? "bg-black/15" : "bg-black/25 blur-[3px]"}`}>
            <p className="text-sm">{revealed ? message.text : "Tap to reveal The One's secret"}</p>
          </div>
          {!revealed && (
            <span className="mt-2 inline-flex items-center gap-1 text-xs text-white/80">
              <Eye className="h-3 w-3" /> hidden message
            </span>
          )}
        </button>
      )}
      {message.type === "poll" && (
        <div className="space-y-2">
          <p className="flex items-center gap-2 text-sm font-semibold"><BarChart3 className="h-4 w-4" /> {message.question}</p>
          {(message.options || []).map((option) => {
            const count = Object.values(message.votes || {}).filter((vote) => vote === option).length;
            return (
              <button key={option} onClick={() => onVote?.(message, option)} className="tap-highlight flex w-full items-center justify-between rounded-2xl bg-white/10 px-3 py-2 text-left text-sm">
                <span>{option}</span>
                <span className="text-xs text-white/70">{count}</span>
              </button>
            );
          })}
        </div>
      )}
      {message.type === "voice" && (
        <div className="flex items-center gap-3 rounded-2xl bg-black/20 p-3">
          <Mic className="h-5 w-5" />
          <div className="h-8 flex-1 rounded-full bg-gradient-to-r from-white/30 via-white/10 to-white/30" />
          <span className="text-xs">{message.duration || "0:12"}</span>
        </div>
      )}
      <p className="mt-2 flex items-center justify-end gap-1 text-[10px] text-white/60">
        <Sparkles className="h-3 w-3" /> {timeLabel(message.createdAt)}
      </p>
    </motion.article>
  );
}
