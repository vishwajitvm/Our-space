import { useEffect, useState } from "react";
import { subscribeRoomState } from "../firebase/firestoreService.js";
import { useAppStore } from "../store/useAppStore.js";
import { seedRoom } from "../utils/seedData.js";

export function useRoomState() {
  const roomId = useAppStore((state) => state.roomId);
  const [roomState, setRoomStateData] = useState(seedRoom(roomId || "LOCAL").roomState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeRoomState(roomId, (next) => {
      setRoomStateData(next);
      setLoading(false);
    });
    return unsubscribe;
  }, [roomId]);

  return { roomState, loading };
}
