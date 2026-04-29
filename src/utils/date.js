import { couple } from "./couple.js";

export function relationshipDays() {
  const start = new Date(couple.startedAt);
  const now = new Date();
  const diff = now.getTime() - start.getTime();
  return Math.max(1, Math.floor(diff / 86400000));
}

export function nextAnniversary() {
  const now = new Date();
  let target = new Date(now.getFullYear(), couple.anniversaryMonth, couple.anniversaryDay);
  if (target < now) target = new Date(now.getFullYear() + 1, couple.anniversaryMonth, couple.anniversaryDay);
  const days = Math.ceil((target.getTime() - now.getTime()) / 86400000);
  return { date: target, days };
}

export function timeLabel(timestamp) {
  const date = new Date(timestamp || Date.now());
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
