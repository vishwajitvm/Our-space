import { create } from "zustand";
import { clearPersistedRoomId, getPersistedRoomId } from "../firebase/firestoreService.js";

const defaultUser = {
  realName: "Visshwa",
  nickname: "AI",
  partnerRealName: "Vandna",
  partnerNickname: "The One",
};

const savedPersona = localStorage.getItem("our-space-persona") || "AI";

export const useAppStore = create((set, get) => ({
  user: defaultUser,
  persona: savedPersona,
  roomId: getPersistedRoomId(),
  toast: null,
  setRoomId: (roomId) => set({ roomId }),
  setPersona: (persona) => {
    localStorage.setItem("our-space-persona", persona);
    set({ persona });
  },
  setUser: (user) => set({ user: { ...get().user, ...user } }),
  showToast: (message, tone = "pink") => {
    set({ toast: { id: Date.now(), message, tone } });
    window.setTimeout(() => {
      if (get().toast?.message === message) set({ toast: null });
    }, 2600);
  },
  leaveRoom: () => {
    clearPersistedRoomId();
    set({ roomId: null });
  },
}));
