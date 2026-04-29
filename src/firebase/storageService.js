import { getDownloadURL, ref, uploadString, uploadBytes } from "firebase/storage";
import { isFirebaseConfigured, requireFirebase, storage, useLocalDemo } from "./config.js";

export async function uploadDataUrl(roomId, folder, dataUrl) {
  if (useLocalDemo && (!isFirebaseConfigured || !storage)) return dataUrl;
  if (!isFirebaseConfigured || !storage) requireFirebase();
  const path = `rooms/${roomId}/${folder}/${crypto.randomUUID()}.png`;
  const fileRef = ref(storage, path);
  await uploadString(fileRef, dataUrl, "data_url");
  return getDownloadURL(fileRef);
}

export async function uploadFile(roomId, folder, file) {
  if (!file) return "";
  if (useLocalDemo && (!isFirebaseConfigured || !storage)) {
    return URL.createObjectURL(file);
  }
  if (!isFirebaseConfigured || !storage) requireFirebase();
  const extension = file.name.split(".").pop() || "jpg";
  const path = `rooms/${roomId}/${folder}/${crypto.randomUUID()}.${extension}`;
  const fileRef = ref(storage, path);
  await uploadBytes(fileRef, file);
  return getDownloadURL(fileRef);
}
