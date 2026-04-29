import { signInAnonymously } from "firebase/auth";
import { auth, isFirebaseConfigured, useLocalDemo } from "./config.js";

export async function ensureAnonymousUser() {
  if (useLocalDemo && (!isFirebaseConfigured || !auth)) {
    return { uid: "local-visshwa-vandna" };
  }

  if (!isFirebaseConfigured || !auth) return null;

  if (auth.currentUser) return auth.currentUser;
  const credential = await signInAnonymously(auth);
  return credential.user;
}
