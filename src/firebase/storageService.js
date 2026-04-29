import { getDownloadURL, ref, uploadString, uploadBytes } from "firebase/storage";
import { isFirebaseConfigured, storage } from "./config.js";

export async function uploadDataUrl(roomId, folder, dataUrl) {
  if (!isFirebaseConfigured || !storage) return dataUrl;
  const path = `rooms/${roomId}/${folder}/${crypto.randomUUID()}.png`;
  const fileRef = ref(storage, path);
  await uploadString(fileRef, dataUrl, "data_url");
  return getDownloadURL(fileRef);
}

export async function uploadFile(roomId, folder, file) {
  if (!file) return "";
  if (!isFirebaseConfigured || !storage) {
    return URL.createObjectURL(file);
  }
  const extension = file.name.split(".").pop() || "jpg";
  const path = `rooms/${roomId}/${folder}/${crypto.randomUUID()}.${extension}`;
  const fileRef = ref(storage, path);
  await uploadBytes(fileRef, file);
  return getDownloadURL(fileRef);
}
