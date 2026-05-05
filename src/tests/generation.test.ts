import { describe, expect, it } from "vitest";
import { createGeneratedGame } from "../lib/generation";
import type { GameTemplate, VibeSettings } from "../types/game";

const settings: VibeSettings = {
  chaos: 42,
  difficulty: "normal",
  reducedMotion: false,
  soundEnabled: false
};

describe("createGeneratedGame", () => {
  it("is deterministic for content fields", () => {
    const first = createGeneratedGame("cozy rainy detective", settings, 0);
    const second = createGeneratedGame("cozy rainy detective", settings, 0);

    expect(first.seed).toBe(second.seed);
    expect(first.title).toBe(second.title);
    expect(first.template).toBe(second.template);
    expect(first.objective).toBe(second.objective);
    expect(first.patchNotes).toEqual(second.patchNotes);
  });

  it("cycles through all templates with remixes", () => {
    const templates = new Set<GameTemplate>();
    for (let remix = 0; remix < 8; remix += 1) {
      templates.add(createGeneratedGame("tiny wizard gardening", settings, remix).template);
    }

    expect(templates).toEqual(
      new Set<GameTemplate>(["click_collect", "avoid_enemy", "memory_match", "tiny_quest"])
    );
  });
});

