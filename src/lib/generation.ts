import type {
  Difficulty,
  GameTemplate,
  GeneratedGame,
  VibeSettings
} from "../types/game";
import {
  boxIcons,
  boxTaglines,
  mergeCopy,
  patchNoteTemplates,
  studioSuffixes,
  subtitles,
  weirdAdjectives,
  weirdNouns
} from "./copy";
import { paletteForSignals } from "./palettes";
import {
  clamp,
  hashString,
  maybe,
  pick,
  randomInt,
  seedFromParts,
  seededRandom,
  slugify,
  titleCase
} from "./rng";
import { analyzeVibe, exampleVibes, sanitizeVibe } from "./vibeAnalysis";

const templates: GameTemplate[] = [
  "click_collect",
  "avoid_enemy",
  "memory_match",
  "tiny_quest"
];

const difficultyScale: Record<Difficulty, { timer: number; target: number; danger: number }> = {
  chill: { timer: 1.22, target: 0.82, danger: 0.78 },
  normal: { timer: 1, target: 1, danger: 1 },
  spicy: { timer: 0.78, target: 1.24, danger: 1.22 }
};

function pluralize(noun: string): string {
  if (noun.endsWith("s")) {
    return noun;
  }
  if (noun.endsWith("y")) {
    return `${noun.slice(0, -1)}ies`;
  }
  return `${noun}s`;
}

function withoutArticle(input: string): string {
  return input.replace(/^(the|a|an)\s+/i, "");
}

function pickCollectible(copy: ReturnType<typeof mergeCopy>, rng: ReturnType<typeof seededRandom>) {
  const phrase = pick(copy.collectibles, rng);
  const singular = phrase.endsWith("s") ? phrase.replace(/s$/, "") : phrase;
  return {
    singular: withoutArticle(singular),
    plural: withoutArticle(phrase.endsWith("s") ? phrase : pluralize(phrase))
  };
}

function makeTitle(
  copy: ReturnType<typeof mergeCopy>,
  rng: ReturnType<typeof seededRandom>,
  settings: VibeSettings,
  playerName: string,
  collectiblePlural: string
): string {
  const adjective = pick(
    [
      ...copy.adjectives,
      ...(settings.chaos > 38 ? weirdAdjectives.slice(0, 4) : []),
      ...(settings.chaos > 70 ? weirdAdjectives : [])
    ],
    rng
  );
  const noun = pick(
    [
      ...copy.nouns,
      ...(settings.chaos > 48 ? weirdNouns.slice(0, 4) : []),
      ...(settings.chaos > 76 ? weirdNouns : [])
    ],
    rng
  );
  const place = pick(copy.places, rng);
  const verb = titleCase(pick(copy.verbs, rng));
  const businessNoun = titleCase(pick([...copy.nouns, ...weirdNouns], rng));
  const formulas = [
    `The ${titleCase(adjective)} ${titleCase(noun)}`,
    `${titleCase(noun)} of the ${titleCase(adjective)} ${titleCase(place)}`,
    `${playerName} and the ${titleCase(noun)} Problem`,
    `${verb} the ${titleCase(collectiblePlural)}`,
    `${titleCase(noun)} Arcade DX`,
    `${businessNoun} Quarterly`
  ];
  return pick(formulas, rng);
}

function makePatchNotes(
  copy: ReturnType<typeof mergeCopy>,
  rng: ReturnType<typeof seededRandom>,
  gameBits: {
    collectiblePlural: string;
    hazardName: string;
    enemyName: string;
    playerName: string;
    place: string;
    soundLabel: string;
  },
  settings: VibeSettings
): string[] {
  const count = settings.chaos > 70 ? 4 : 3;
  const templatesToUse = [...patchNoteTemplates];
  const notes: string[] = [];
  for (let index = 0; index < count; index += 1) {
    const template = pick(templatesToUse, rng);
    const percent = randomInt(rng, 8, settings.chaos > 70 ? 88 : 24);
    const oldCount = randomInt(rng, 5, 12);
    const newCount = Math.max(1, oldCount - randomInt(rng, 1, 3));
    notes.push(
      template
        .replace("{collectiblePlural}", gameBits.collectiblePlural)
        .replace("{hazardName}", gameBits.hazardName)
        .replace("{enemyName}", gameBits.enemyName)
        .replace("{playerName}", gameBits.playerName)
        .replace("{place}", gameBits.place)
        .replace("{soundLabel}", gameBits.soundLabel)
        .replace("{percent}", String(percent))
        .replace("{oldCount}", String(oldCount))
        .replace("{newCount}", String(newCount))
        .replace("{noun}", pick([...copy.nouns, ...copy.collectibles], rng))
    );
  }
  return notes;
}

function makeInstructions(
  template: GameTemplate,
  collectiblePlural: string,
  hazardName: string,
  enemyName: string,
  progressName: string
): string[] {
  switch (template) {
    case "click_collect":
      return [
        `Click ${collectiblePlural} before they blink away.`,
        `${titleCase(hazardName)} drain score or time.`,
        "Reach the target before the timer hits zero."
      ];
    case "avoid_enemy":
      return [
        "Move with WASD, arrow keys, or touch buttons.",
        `Collect ${collectiblePlural} while dodging ${enemyName}.`,
        "A hit costs health, but you get a brief mercy flash."
      ];
    case "memory_match":
      return [
        `Flip cards to match every ${collectiblePlural} pair.`,
        "Mismatches flip back after a tiny dramatic pause.",
        "Finish before time or moves run out."
      ];
    case "tiny_quest":
      return [
        `Choose actions to gain ${progressName}.`,
        `Charm and Rest are safer; Sneak and Duel are swingier.`,
        "Win before resolve or turns run out."
      ];
    default:
      return ["Play the tiny game. Win the tiny victory."];
  }
}

function makeObjective(
  template: GameTemplate,
  target: number,
  collectiblePlural: string,
  hazardName: string,
  place: string,
  progressName: string
): string {
  switch (template) {
    case "click_collect":
      return `Collect ${target} ${collectiblePlural} before ${place} closes. Dodge ${hazardName}.`;
    case "avoid_enemy":
      return `Gather ${target} ${collectiblePlural} while staying upright in ${place}.`;
    case "memory_match":
      return `Match the ${collectiblePlural} before your focus budget evaporates.`;
    case "tiny_quest":
      return `Build ${target} ${progressName} before ${place} files a complaint.`;
    default:
      return `Collect ${target} ${collectiblePlural}.`;
  }
}

function tuneGame(
  template: GameTemplate,
  difficulty: Difficulty,
  chaos: number,
  rng: ReturnType<typeof seededRandom>
): GeneratedGame["tuning"] {
  const scale = difficultyScale[difficulty];
  const chaosPush = 1 + clamp(chaos, 0, 100) / 500;
  const targetBase = template === "memory_match" ? 6 : template === "tiny_quest" ? 10 : 9;
  const targetScore = Math.max(3, Math.round(targetBase * scale.target + randomInt(rng, 0, 2)));

  if (template === "click_collect") {
    return {
      durationSeconds: Math.round(36 * scale.timer),
      targetScore,
      maxHealth: 1,
      spawnRate: Math.max(520, Math.round(980 / scale.danger / chaosPush))
    };
  }

  if (template === "avoid_enemy") {
    return {
      durationSeconds: Math.round(42 * scale.timer),
      targetScore,
      maxHealth: difficulty === "chill" ? 5 : difficulty === "normal" ? 4 : 3,
      enemySpeed: (difficulty === "chill" ? 0.55 : difficulty === "normal" ? 0.74 : 0.95) * chaosPush,
      enemyCount: difficulty === "chill" ? 2 : difficulty === "normal" ? 3 : 4,
      spawnRate: Math.round(1200 / scale.danger)
    };
  }

  if (template === "memory_match") {
    const pairCount = difficulty === "chill" ? 6 : difficulty === "normal" ? 8 : 10;
    return {
      durationSeconds: difficulty === "chill" ? 90 : difficulty === "normal" ? 76 : 62,
      targetScore: pairCount,
      maxHealth: 1,
      pairCount,
      moveLimit: difficulty === "chill" ? pairCount * 4 : difficulty === "normal" ? pairCount * 3 : Math.ceil(pairCount * 2.55)
    };
  }

  return {
    durationSeconds: 0,
    targetScore,
    maxHealth: difficulty === "chill" ? 14 : difficulty === "normal" ? 12 : 10,
    maxTurns: difficulty === "chill" ? 18 : difficulty === "normal" ? 15 : 12
  };
}

export function chooseExampleVibe(seed: number): string {
  const rng = seededRandom(seed);
  return pick(exampleVibes, rng);
}

export function createGeneratedGame(
  rawVibe: string,
  settings: VibeSettings,
  remixIndex = 0
): GeneratedGame {
  const fallback = chooseExampleVibe(Date.now());
  const safeVibe = sanitizeVibe(rawVibe || fallback);
  const baseSeed = seedFromParts([
    safeVibe.toLowerCase(),
    clamp(settings.chaos, 0, 100),
    settings.difficulty,
    remixIndex
  ]);
  const rng = seededRandom(baseSeed);
  const analysis = analyzeVibe(safeVibe, settings);
  const copy = mergeCopy(analysis.signals);
  const palette = paletteForSignals(analysis.signals, rng);
  const template = templates[(hashString(safeVibe.toLowerCase()) + remixIndex) % templates.length];
  const collectible = pickCollectible(copy, rng);
  const playerName = pick(copy.players, rng);
  const hazardName = pick(
    [
      ...copy.hazards,
      ...(settings.chaos > 62 ? weirdNouns.map((noun) => `${noun} hazard`) : [])
    ],
    rng
  );
  const enemyName = pick(copy.enemies, rng);
  const place = pick(copy.places, rng);
  const progressName = pick(copy.progress, rng);
  const soundLabel = pick(copy.sounds, rng);
  const title = makeTitle(copy, rng, settings, playerName, collectible.plural);
  const studioCore = titleCase(
    maybe(analysis.keywords, rng, 0.6) ?? pick([...copy.nouns, ...copy.places], rng)
  );
  const tuning = tuneGame(template, settings.difficulty, settings.chaos, rng);
  const objective = makeObjective(
    template,
    tuning.targetScore,
    collectible.plural,
    hazardName,
    place,
    progressName
  );
  const boxIcon = pick(boxIcons, rng);
  const motif = pick(copy.motifs, rng);

  return {
    id: `${slugify(safeVibe)}-${baseSeed.toString(36)}-${remixIndex}`,
    createdAt: new Date().toISOString(),
    vibe: safeVibe,
    seed: baseSeed,
    remixIndex,
    template,
    title,
    subtitle: pick(subtitles, rng),
    studio: `${studioCore} ${pick(studioSuffixes, rng)}`,
    palette,
    playerName,
    collectibleName: collectible.singular,
    collectiblePlural: collectible.plural,
    hazardName,
    enemyName,
    progressName,
    objective,
    winText: `You made ${place} believe in ${progressName}.`,
    loseText: `${enemyName} turned the lights off, but the cabinet kept your initials warm.`,
    instructions: makeInstructions(
      template,
      collectible.plural,
      hazardName,
      enemyName,
      progressName
    ),
    patchNotes: makePatchNotes(
      copy,
      rng,
      {
        collectiblePlural: collectible.plural,
        hazardName,
        enemyName,
        playerName,
        place,
        soundLabel
      },
      settings
    ),
    boxArt: {
      icon: boxIcon,
      motif,
      tagline: pick(boxTaglines, rng)
    },
    flavor: {
      actionVerb: pick(copy.verbs, rng),
      place,
      soundLabel,
      uiNoun: pick(copy.uiNouns, rng),
      motif
    },
    tuning
  };
}

export function shareSummary(game: GeneratedGame): string {
  return [
    `${game.title} by ${game.studio}`,
    `Vibe: ${game.vibe}`,
    `Template: ${game.template.replace("_", " ")}`,
    `Objective: ${game.objective}`,
    `Patch notes: ${game.patchNotes.join(" ")}`
  ].join("\n");
}

