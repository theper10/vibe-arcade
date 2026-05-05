export type RNG = () => number;

export function hashString(input: string): number {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function seededRandom(seed: number): RNG {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let mixed = value;
    mixed = Math.imul(mixed ^ (mixed >>> 15), mixed | 1);
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  };
}

export function seedFromParts(parts: Array<string | number | boolean>): number {
  return hashString(parts.map(String).join("|"));
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function randomInt(rng: RNG, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

export function pick<T>(items: readonly T[], rng: RNG): T {
  if (items.length === 0) {
    throw new Error("Cannot pick from an empty list.");
  }
  return items[Math.floor(rng() * items.length)];
}

export function maybe<T>(items: readonly T[], rng: RNG, chance: number): T | undefined {
  if (rng() > chance || items.length === 0) {
    return undefined;
  }
  return pick(items, rng);
}

export function weightedPick<T>(
  items: ReadonlyArray<{ item: T; weight: number }>,
  rng: RNG
): T {
  if (items.length === 0) {
    throw new Error("Cannot weightedPick from an empty list.");
  }
  const total = items.reduce((sum, current) => sum + Math.max(0, current.weight), 0);
  if (total <= 0) {
    return items[0].item;
  }
  let cursor = rng() * total;
  for (const current of items) {
    cursor -= Math.max(0, current.weight);
    if (cursor <= 0) {
      return current.item;
    }
  }
  return items[items.length - 1].item;
}

export function shuffle<T>(items: readonly T[], rng: RNG): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rng() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

export function titleCase(input: string): string {
  return input
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function slugify(input: string): string {
  const slug = input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "vibe-game";
}

