const listeners = new Map();

function key(path) {
  return `our-space:${path}`;
}

function read(path, fallback) {
  try {
    const raw = localStorage.getItem(key(path));
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(path, value) {
  localStorage.setItem(key(path), JSON.stringify(value));
  const callbacks = listeners.get(path);
  callbacks?.forEach((callback) => callback(value));
}

export function localGet(path, fallback = null) {
  return read(path, fallback);
}

export function localSet(path, value) {
  write(path, value);
  return value;
}

export function localPush(path, item) {
  const list = read(path, []);
  const next = [{ id: crypto.randomUUID(), ...item, createdAt: Date.now() }, ...list];
  write(path, next);
  return next[0];
}

export function localUpdateItem(path, id, patch) {
  const list = read(path, []);
  const next = list.map((item) => (item.id === id ? { ...item, ...patch } : item));
  write(path, next);
}

export function localSubscribe(path, fallback, callback) {
  callback(read(path, fallback));
  const set = listeners.get(path) || new Set();
  set.add(callback);
  listeners.set(path, set);
  return () => {
    set.delete(callback);
    if (set.size === 0) listeners.delete(path);
  };
}
