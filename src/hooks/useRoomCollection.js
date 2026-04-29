import { useEffect, useState } from "react";
import { subscribeRoomCollection } from "../firebase/firestoreService.js";
import { useAppStore } from "../store/useAppStore.js";

export function useRoomCollection(collectionName, fallback = []) {
  const roomId = useAppStore((state) => state.roomId);
  const [items, setItems] = useState(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeRoomCollection(roomId, collectionName, (next) => {
      setItems(next);
      setLoading(false);
    });
    return unsubscribe;
  }, [roomId, collectionName]);

  return { items, loading };
}
