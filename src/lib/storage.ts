export function storageAvailable(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  try {
    const key = "__vibe_arcade_storage_test__";
    window.localStorage.setItem(key, key);
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

