export function safeJsonParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export function readLocalStorageJson<T>(key: string): T | null {
  return safeJsonParse<T>(localStorage.getItem(key));
}

export function writeLocalStorageJson(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeLocalStorageKey(key: string) {
  localStorage.removeItem(key);
}
