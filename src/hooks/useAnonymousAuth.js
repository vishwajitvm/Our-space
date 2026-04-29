import { useEffect } from "react";
import { ensureAnonymousUser } from "../firebase/authService.js";
import { useAppStore } from "../store/useAppStore.js";

export function useAnonymousAuth() {
  const showToast = useAppStore((state) => state.showToast);

  useEffect(() => {
    ensureAnonymousUser().catch(() => {
      showToast("Could not sign in anonymously yet. Check Firebase env.", "blue");
    });
  }, [showToast]);
}
