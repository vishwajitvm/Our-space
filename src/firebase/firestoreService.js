import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db, isFirebaseConfigured, requireFirebase, useLocalDemo } from "./config.js";
import { localGet, localPush, localSet, localSubscribe, localUpdateItem } from "./localStore.js";
import { ensureAnonymousUser } from "./authService.js";
import { seedRoom } from "../utils/seedData.js";

const ROOM_META = "meta/details";

function roomPath(roomId, path) {
  return `rooms/${roomId}/${path}`;
}

function normalizeDoc(snapshot) {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    ...data,
    createdAt: data.createdAt?.toMillis?.() || data.createdAt || Date.now(),
    updatedAt: data.updatedAt?.toMillis?.() || data.updatedAt || Date.now(),
  };
}

export async function createRoom({ creator = "AI" } = {}) {
  const user = await ensureAnonymousUser();
  const roomId = `OUR-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  const seed = seedRoom(roomId);

  if (isFirebaseConfigured) {
    await setDoc(doc(db, "rooms", roomId), {
      roomId,
      inviteCode: roomId,
      privateFor: ["AI", "The One"],
      ownerUid: user.uid,
      memberCount: 1,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    await setDoc(doc(db, roomPath(roomId, `members/${user.uid}`)), {
      uid: user.uid,
      persona: creator,
      joinedAt: serverTimestamp(),
    });
    await setDoc(doc(db, roomPath(roomId, ROOM_META)), {
      ...seed.meta,
      creator,
      roomId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    await Promise.all([
      ...seed.messages.map((message) => addRoomDoc(roomId, "messages", message)),
      ...seed.activities.map((activity) => addRoomDoc(roomId, "activities", activity)),
      ...seed.memories.map((memory) => addRoomDoc(roomId, "memories", memory)),
      ...seed.letters.map((letter) => addRoomDoc(roomId, "letters", letter)),
      ...seed.bucketlist.map((item) => addRoomDoc(roomId, "bucketlist", item)),
      setRoomState(roomId, seed.roomState),
    ]);
  } else if (useLocalDemo) {
    localSet(roomPath(roomId, ROOM_META), { ...seed.meta, creator, roomId, createdAt: Date.now() });
    localSet(roomPath(roomId, "messages"), seed.messages.map((item) => ({ id: crypto.randomUUID(), ...item, createdAt: Date.now() })));
    localSet(roomPath(roomId, "activities"), seed.activities.map((item) => ({ id: crypto.randomUUID(), ...item, createdAt: Date.now() })));
    localSet(roomPath(roomId, "memories"), seed.memories.map((item) => ({ id: crypto.randomUUID(), ...item, createdAt: Date.now() })));
    localSet(roomPath(roomId, "letters"), seed.letters.map((item) => ({ id: crypto.randomUUID(), ...item, createdAt: Date.now() })));
    localSet(roomPath(roomId, "bucketlist"), seed.bucketlist.map((item) => ({ id: crypto.randomUUID(), ...item, createdAt: Date.now() })));
    localSet(roomPath(roomId, "roomState/current"), seed.roomState);
  } else {
    requireFirebase();
  }

  localStorage.setItem("our-space-room-id", roomId);
  return roomId;
}

export async function joinRoom(inviteCode) {
  const user = await ensureAnonymousUser();
  const roomId = inviteCode.trim().toUpperCase();
  if (!roomId) throw new Error("Enter your private room code.");

  if (isFirebaseConfigured) {
    const snapshot = await getDoc(doc(db, "rooms", roomId));
    if (!snapshot.exists()) throw new Error("No room found for that invite code.");
    if (snapshot.data().inviteCode !== roomId) throw new Error("Invite code does not match this private room.");
    const memberSnapshot = await getDoc(doc(db, roomPath(roomId, `members/${user.uid}`)));
    const alreadyMember = memberSnapshot.exists();
    if (!alreadyMember && (snapshot.data().memberCount || 1) >= 2) {
      throw new Error("This private room already belongs to AI and The One.");
    }
    await setDoc(doc(db, roomPath(roomId, `members/${user.uid}`)), {
      uid: user.uid,
      persona: localStorage.getItem("our-space-persona") || "The One",
      joinedAt: serverTimestamp(),
    });
    if (!alreadyMember) {
      await setDoc(doc(db, "rooms", roomId), { memberCount: 2, updatedAt: serverTimestamp() }, { merge: true });
    }
  } else if (useLocalDemo && !localGet(roomPath(roomId, ROOM_META))) {
    localSet(roomPath(roomId, ROOM_META), seedRoom(roomId).meta);
  } else if (!useLocalDemo) {
    requireFirebase();
  }

  localStorage.setItem("our-space-room-id", roomId);
  return roomId;
}

export function getPersistedRoomId() {
  return localStorage.getItem("our-space-room-id");
}

export function clearPersistedRoomId() {
  localStorage.removeItem("our-space-room-id");
}

export async function addRoomDoc(roomId, collectionName, data) {
  const payload = { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() };
  if (isFirebaseConfigured) {
    return addDoc(collection(db, roomPath(roomId, collectionName)), payload);
  }
  if (useLocalDemo) return localPush(roomPath(roomId, collectionName), { ...data, updatedAt: Date.now() });
  requireFirebase();
}

export function subscribeRoomCollection(roomId, collectionName, callback, limitTo = 80) {
  if (!roomId) return () => {};
  if (isFirebaseConfigured) {
    const ref = query(collection(db, roomPath(roomId, collectionName)), orderBy("createdAt", "desc"));
    return onSnapshot(ref, (snapshot) => callback(snapshot.docs.slice(0, limitTo).map(normalizeDoc)));
  }
  if (useLocalDemo) return localSubscribe(roomPath(roomId, collectionName), [], (items) => callback(items.slice(0, limitTo)));
  callback([]);
  return () => {};
}

export function subscribeRoomState(roomId, callback) {
  if (!roomId) return () => {};
  if (isFirebaseConfigured) {
    return onSnapshot(doc(db, roomPath(roomId, "roomState/current")), (snapshot) => {
      callback(snapshot.exists() ? normalizeDoc(snapshot) : seedRoom(roomId).roomState);
    });
  }
  if (useLocalDemo) return localSubscribe(roomPath(roomId, "roomState/current"), seedRoom(roomId).roomState, callback);
  callback(seedRoom(roomId).roomState);
  return () => {};
}

export async function setRoomState(roomId, data) {
  const payload = { ...data, updatedAt: serverTimestamp() };
  if (isFirebaseConfigured) {
    return setDoc(doc(db, roomPath(roomId, "roomState/current")), payload, { merge: true });
  }
  if (useLocalDemo) return localSet(roomPath(roomId, "roomState/current"), { ...localGet(roomPath(roomId, "roomState/current"), {}), ...data, updatedAt: Date.now() });
  requireFirebase();
}

export async function updateMessage(roomId, messageId, patch) {
  if (isFirebaseConfigured) {
    return updateDoc(doc(db, roomPath(roomId, `messages/${messageId}`)), { ...patch, updatedAt: serverTimestamp() });
  }
  if (useLocalDemo) return localUpdateItem(roomPath(roomId, "messages"), messageId, { ...patch, updatedAt: Date.now() });
  requireFirebase();
}
