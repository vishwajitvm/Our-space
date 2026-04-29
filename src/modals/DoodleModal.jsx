import { RotateCcw, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ActionButton from "../components/ui/ActionButton.jsx";
import ModalShell from "../components/ui/ModalShell.jsx";

export default function DoodleModal({ open, onClose, onSend, title = "Draw for The One" }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const [color, setColor] = useState("#ff4d8d");

  useEffect(() => {
    if (!open) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    context.scale(ratio, ratio);
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, rect.width, rect.height);
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = 5;
  }, [open]);

  function point(event) {
    const touch = event.touches?.[0];
    const target = touch || event;
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: target.clientX - rect.left, y: target.clientY - rect.top };
  }

  function start(event) {
    drawing.current = true;
    const context = canvasRef.current.getContext("2d");
    const p = point(event);
    context.strokeStyle = color;
    context.beginPath();
    context.moveTo(p.x, p.y);
  }

  function move(event) {
    if (!drawing.current) return;
    event.preventDefault();
    const context = canvasRef.current.getContext("2d");
    const p = point(event);
    context.lineTo(p.x, p.y);
    context.stroke();
  }

  function stop() {
    drawing.current = false;
  }

  function clear() {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, rect.width, rect.height);
  }

  function send() {
    onSend(canvasRef.current.toDataURL("image/png"));
    onClose();
  }

  return (
    <ModalShell open={open} onClose={onClose} title={title}>
      <canvas
        ref={canvasRef}
        onMouseDown={start}
        onMouseMove={move}
        onMouseUp={stop}
        onMouseLeave={stop}
        onTouchStart={start}
        onTouchMove={move}
        onTouchEnd={stop}
        className="h-[58vh] w-full touch-none rounded-3xl bg-white shadow-inner"
      />
      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex gap-2">
          {["#ff4d8d", "#8b5cf6", "#5da9ff", "#111827"].map((swatch) => (
            <button key={swatch} onClick={() => setColor(swatch)} className="h-9 w-9 rounded-full border-2 border-white/20" style={{ background: swatch }} />
          ))}
        </div>
        <div className="flex gap-2">
          <ActionButton type="button" tone="soft" icon={RotateCcw} onClick={clear} />
          <ActionButton type="button" icon={Send} onClick={send}>Send</ActionButton>
        </div>
      </div>
    </ModalShell>
  );
}
