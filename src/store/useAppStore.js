import { create } from "zustand";
import { clearPersistedRoomId, getPersistedRoomId } from "../firebase/firestoreService.js";

const defaultUser = {
  realName: "Visshwa",
  nickname: "AI",
  partnerRealName: "Vandna",
  partnerNickname: "The One",
};

export const useAppStore = create((set, get) => ({
  user: defaultUser,
  roomId: getPersistedRoomId(),
  toast: null,
  setRoomId: (roomId) => set({ roomId }),
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
