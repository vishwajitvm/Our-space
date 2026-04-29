import { signInAnonymously } from "firebase/auth";
import { auth, isFirebaseConfigured } from "./config.js";

export async function ensureAnonymousUser() {
  if (!isFirebaseConfigured || !auth) {
    return { uid: "local-visshwa-vandna" };
  }

  if (auth.currentUser) return auth.currentUser;
  const credential = await signInAnonymously(auth);
  return credential.user;
}
