import type { VibeSignal } from "../types/game";

export interface SignalCopy {
  adjectives: string[];
  nouns: string[];
  places: string[];
  verbs: string[];
  players: string[];
  enemies: string[];
  collectibles: string[];
  hazards: string[];
  motifs: string[];
  sounds: string[];
  uiNouns: string[];
  progress: string[];
}

export const baseCopy: SignalCopy = {
  adjectives: ["glowing", "tiny", "peculiar", "midnight", "pocket", "strange"],
  nouns: ["token", "cabinet", "ritual", "quest", "button", "trinket"],
  places: ["back room", "token parlor", "corner booth", "mini arena", "neon nook"],
  verbs: ["collect", "rescue", "decode", "polish", "befriend", "bonk"],
  players: ["The Little Champion", "Captain Button", "Pocket Hero", "Arcade Intern"],
  enemies: ["The Wobbler", "A Suspicious Shape", "The Deadline", "Static Baron"],
  collectibles: ["tokens", "charms", "sparks", "badges", "secrets", "snacks"],
  hazards: ["static puddles", "fake prizes", "dramatic fog", "rubber deadlines"],
  motifs: ["scanlines", "cabinet lights", "sticker stars", "soft static"],
  sounds: ["bleep", "bloop", "plink", "zap", "tink"],
  uiNouns: ["cartridge", "stage", "cabinet", "token slot"],
  progress: ["progress", "tokens", "proof", "sparkle"]
};

export const weirdAdjectives = [
  "municipal",
  "left-handed",
  "emotionally laminated",
  "taxable",
  "suspiciously damp",
  "maximum tiny",
  "professionally haunted",
  "snack-adjacent",
  "velvet-coded"
];

export const weirdNouns = [
  "spreadsheet lantern",
  "moon invoice",
  "juice goblet",
  "secret toaster",
  "emergency kazoo",
  "velvet spreadsheet",
  "tiny subpoena",
  "courage waffle"
];

export const studioSuffixes = [
  "Softworks",
  "Cabinet Club",
  "Token Bureau",
  "Pocket Division",
  "After Hours",
  "Tiny Systems",
  "Miniworks",
  "Lunchbreak Labs"
];

export const templateLabels = {
  click_collect: "Click-to-Collect",
  avoid_enemy: "Avoid-the-Enemy",
  memory_match: "Memory Match",
  tiny_quest: "Tiny Quest"
} as const;

export const signalCopy: Record<VibeSignal, Partial<SignalCopy>> = {
  cozy: {
    adjectives: ["cozy", "rainy", "woolly", "warm-lit", "murmuring"],
    nouns: ["umbrella", "teacup", "receipt", "window", "lantern"],
    places: ["late cafe", "rain booth", "blanket arcade", "steamy alley"],
    verbs: ["sip", "collect", "comfort", "solve", "tidy"],
    players: ["The Umbrella Clerk", "Detective Biscuit", "The Rain Listener"],
    enemies: ["The Overcoat", "Dramatic Thunder", "The Cold Draft"],
    collectibles: ["clues", "tea leaves", "puddle prints", "warm receipts"],
    hazards: ["false leads", "cold drafts", "soggy alibis"],
    motifs: ["rain streaks", "mug steam", "amber lamps"],
    sounds: ["mug clink", "rain plink", "soft ding"],
    uiNouns: ["case file", "cozy cabinet"],
    progress: ["clues", "comfort", "receipts"]
  },
  spooky: {
    adjectives: ["spooky", "pumpkin-lit", "foggy", "midnight", "almost scary"],
    nouns: ["crypt", "lantern", "portrait", "bell", "attic"],
    places: ["friendly crypt", "lantern hall", "fog arcade"],
    verbs: ["haunt", "untangle", "light", "shiver", "rescue"],
    players: ["The Polite Ghost", "Lantern Keeper", "Captain Cobweb"],
    enemies: ["The Door That Sighs", "Mister Boo-ish", "The Candle Baron"],
    collectibles: ["friendly ghosts", "lantern wicks", "brave crumbs"],
    hazards: ["jump-scare coupons", "creaky stairs", "suspicious portraits"],
    motifs: ["soft fog", "paper bats", "lantern flicker"],
    sounds: ["boo-blip", "candle pop", "floorboard squeak"],
    uiNouns: ["crypt cart", "lantern log"],
    progress: ["bravery", "candles", "ghost notes"]
  },
  cyberpunk: {
    adjectives: ["neon", "chrome", "glitched", "laser-wet", "synthetic"],
    nouns: ["server", "visor", "noodle sign", "datastream", "alley"],
    places: ["neon underpass", "noodle firewall", "chrome district"],
    verbs: ["hack", "jack", "reroute", "collect", "debug"],
    players: ["Glitch Courier", "The Soft Hacker", "Neon Sprinter"],
    enemies: ["Adware Seraph", "The Pop-up Authority", "Chrome Debt"],
    collectibles: ["data charms", "neon packets", "clean signals"],
    hazards: ["lag puddles", "sponsored malware", "laser invoices"],
    motifs: ["scanlines", "glitch rain", "ad holograms"],
    sounds: ["sync zap", "modem chirp", "laser plink"],
    uiNouns: ["deck", "signal cart"],
    progress: ["signals", "packets", "sync"]
  },
  fantasy: {
    adjectives: ["dragonish", "questing", "torchlit", "brave-ish", "enchanted"],
    nouns: ["dragon", "keep", "rune", "sword", "goblet"],
    places: ["snack dungeon", "lantern keep", "tiny tavern"],
    verbs: ["quest", "parry", "summon", "gather", "befriend"],
    players: ["Sir Buttoncap", "The Snack Knight", "Page of Sparks"],
    enemies: ["The Minor Dragon", "Oath Goblet", "The Tax Wyvern"],
    collectibles: ["runes", "tiny swords", "quest crumbs"],
    hazards: ["dramatic barrels", "oath splinters", "angry cauldrons"],
    motifs: ["torch sparks", "rune circles", "tiny banners"],
    sounds: ["rune pop", "sword tink", "dragon cough"],
    uiNouns: ["quest cart", "tiny keep"],
    progress: ["honor", "runes", "quest points"]
  },
  detective: {
    adjectives: ["suspicious", "rain-slick", "brilliant", "buttoned", "alibi-proof"],
    nouns: ["clue", "case", "receipt", "magnifier", "umbrella"],
    places: ["wet alley", "coffee stakeout", "lost-and-found bureau"],
    verbs: ["inspect", "deduce", "collect", "cross-examine", "decode"],
    players: ["Detective Button", "Inspector Drizzle", "The Tiny Sleuth"],
    enemies: ["The Overcoat", "False Lead", "Baron Alibi"],
    collectibles: ["clues", "wet receipts", "puddle prints", "alibi crumbs"],
    hazards: ["false leads", "dramatic thunder", "red herrings"],
    motifs: ["case strings", "rain lines", "desk lamps"],
    sounds: ["typewriter ding", "clue plink", "rain tap"],
    uiNouns: ["case file", "evidence tray"],
    progress: ["clues", "evidence", "deductions"]
  },
  food: {
    adjectives: ["crispy", "saucy", "midnight", "snackable", "buttery"],
    nouns: ["dumpling", "ramen moon", "soup badge", "toast", "pizza star"],
    places: ["night market", "snack arcade", "soup alley"],
    verbs: ["season", "collect", "simmer", "flip", "rescue"],
    players: ["Chef Button", "The Tiny Ladle", "Snack Knight"],
    enemies: ["Burnt Edge", "The Hungry Timer", "Soggy Coupon"],
    collectibles: ["snacks", "soup stars", "crisp tokens"],
    hazards: ["burnt bits", "spicy invoices", "slippery noodles"],
    motifs: ["steam curls", "menu lights", "salt sparkles"],
    sounds: ["pan pop", "soup bloop", "toast ding"],
    uiNouns: ["menu cart", "snack board"],
    progress: ["flavor", "snacks", "stars"]
  },
  garden: {
    adjectives: ["mossy", "sprouting", "moonlit", "dew-bright", "green"],
    nouns: ["sprout", "mushroom", "watering can", "greenhouse", "seed"],
    places: ["tiny greenhouse", "moon garden", "fern cabinet"],
    verbs: ["grow", "water", "prune", "collect", "befriend"],
    players: ["Tiny Wizard Gardener", "Sprout Tender", "Moss Apprentice"],
    enemies: ["The Thirsty Weed", "Slugsworth", "Overexcited Compost"],
    collectibles: ["sprouts", "seed charms", "dew drops"],
    hazards: ["grumpy weeds", "mud socks", "cursed mulch"],
    motifs: ["leaf shimmer", "mushroom dots", "dew beads"],
    sounds: ["sprout pop", "water plink", "moss hush"],
    uiNouns: ["greenhouse cart", "seed tray"],
    progress: ["sprouts", "growth", "bloom"]
  },
  ocean: {
    adjectives: ["tidal", "coral", "briny", "submerged", "bubble-lit"],
    nouns: ["reef", "submarine", "pearl", "anchor", "tide"],
    places: ["reef arcade", "bubble trench", "submarine snack bar"],
    verbs: ["dive", "collect", "bubble", "rescue", "chart"],
    players: ["Pearl Pilot", "Captain Bubble", "The Tiny Diver"],
    enemies: ["The Jealous Kelp", "Invoice Eel", "Captain Current"],
    collectibles: ["pearls", "bubble maps", "coral charms"],
    hazards: ["rude currents", "sneaky kelp", "salt popups"],
    motifs: ["bubbles", "wave lines", "coral dots"],
    sounds: ["bubble blip", "reef chime", "sonar ping"],
    uiNouns: ["sub cart", "reef board"],
    progress: ["pearls", "depth", "maps"]
  },
  space: {
    adjectives: ["orbital", "moonlit", "cosmic", "zero-g", "stardusted"],
    nouns: ["moon", "rocket", "satellite", "planet", "star map"],
    places: ["orbital diner", "moon arcade", "satellite booth"],
    verbs: ["orbit", "launch", "collect", "scan", "rescue"],
    players: ["Moon Courier", "Captain Comet", "The Small Astronaut"],
    enemies: ["Snackless Moon", "Asteroid Clerk", "The Gravity Bill"],
    collectibles: ["star snacks", "moon receipts", "orbit coins"],
    hazards: ["meteor crumbs", "gravity hiccups", "vacuum fees"],
    motifs: ["starfields", "orbit rings", "radar dots"],
    sounds: ["cosmic ping", "thruster pop", "satellite beep"],
    uiNouns: ["rocket cart", "orbit board"],
    progress: ["stars", "orbits", "fuel"]
  },
  goblin: {
    adjectives: ["shiny", "muddy", "profit-hungry", "pocket-sized", "cha-cha"],
    nouns: ["goblin", "coin jar", "mushroom desk", "shiny asset", "receipt cave"],
    places: ["basement exchange", "shiny office", "mushroom market"],
    verbs: ["hoard", "audit", "collect", "haggle", "polish"],
    players: ["Profit Goblin", "Moss Accountant", "Quarterly Scrambler"],
    enemies: ["Audit Imp", "Compliance Wizard", "The Invoice Pit"],
    collectibles: ["shiny assets", "coin crumbs", "ethics stickers"],
    hazards: ["cursed invoices", "audit imps", "mandatory meetings"],
    motifs: ["coin glints", "receipt piles", "mossy charts"],
    sounds: ["coin clank", "ledger squeak", "asset plink"],
    uiNouns: ["ledger cart", "quarterly board"],
    progress: ["assets", "profit", "morale"]
  },
  corporate: {
    adjectives: ["quarterly", "synergistic", "actionable", "laminated", "stakeholder"],
    nouns: ["spreadsheet", "meeting", "invoice", "dashboard", "slide deck"],
    places: ["conference dungeon", "breakroom arcade", "synergy booth"],
    verbs: ["align", "audit", "collect", "circle back", "monetize"],
    players: ["Chief Tiny Officer", "The Intern Supreme", "Spreadsheet Paladin"],
    enemies: ["The Deadline", "Budget Wraith", "Meeting Hydra"],
    collectibles: ["action items", "shiny assets", "calendar crumbs"],
    hazards: ["reply-all storms", "cursed invoices", "scope creep"],
    motifs: ["chart glow", "sticky notes", "calendar sparks"],
    sounds: ["calendar ding", "spreadsheet pop", "meeting thunk"],
    uiNouns: ["quarterly cart", "deck"],
    progress: ["assets", "morale", "alignment"]
  },
  chaotic: {
    adjectives: ["unhinged", "spark-spitting", "confetti", "wobbly", "feral"],
    nouns: ["panic button", "kazoo portal", "confetti engine", "oops machine", "scream bean"],
    places: ["confetti void", "oops arcade", "panic ballroom"],
    verbs: ["scramble", "bonk", "ignite", "shuffle", "yell politely at"],
    players: ["The Responsible Panic", "Captain Oops", "Button Comet"],
    enemies: ["The Consequence", "Invoice Tornado", "Several Bad Ideas"],
    collectibles: ["confetti bolts", "oops tokens", "panic gems"],
    hazards: ["rogue buttons", "surprise paperwork", "loose kazoos"],
    motifs: ["confetti sparks", "wobble lights", "wild scanlines"],
    sounds: ["kazoo zap", "oops bloop", "confetti crackle"],
    uiNouns: ["oops cart", "panic board"],
    progress: ["momentum", "sparks", "controlled chaos"]
  },
  cute: {
    adjectives: ["tiny", "plush", "button-nosed", "soft", "sparkly"],
    nouns: ["teacup", "sticker", "star bun", "plush cape", "mini wand"],
    places: ["sticker arcade", "tiny tea room", "sparkle booth"],
    verbs: ["cuddle", "collect", "twinkle", "rescue", "nudge"],
    players: ["Tiny Champion", "Sticker Mage", "Plush Pilot"],
    enemies: ["The Sulk", "Frowny Coupon", "Dust Bunny Baron"],
    collectibles: ["stickers", "star buns", "sparkle buttons"],
    hazards: ["tiny frowns", "dust puffs", "wobbly shelves"],
    motifs: ["stickers", "soft stars", "round buttons"],
    sounds: ["twinkle", "soft pop", "button plink"],
    uiNouns: ["sticker cart", "sparkle tray"],
    progress: ["sparkles", "stickers", "joy"]
  },
  cursed: {
    adjectives: ["cursed", "forbidden", "sideways", "moon-chewed", "ominous-but-cute"],
    nouns: ["hex", "mirror", "left sock", "whisper jar", "bad idea"],
    places: ["forbidden breakroom", "hex arcade", "mirror booth"],
    verbs: ["unhex", "collect", "appease", "decode", "politely banish"],
    players: ["Hex Intern", "The Sock Oracle", "Mirror Clerk"],
    enemies: ["The Bad Vibe", "Sock Wraith", "Cursed Pop-up"],
    collectibles: ["hex receipts", "lucky socks", "whisper tokens"],
    hazards: ["tiny curses", "mirror fees", "sideways puddles"],
    motifs: ["hex rings", "tilted stars", "cracked mirrors"],
    sounds: ["hex hum", "mirror ping", "sock thump"],
    uiNouns: ["hex cart", "curse ledger"],
    progress: ["luck", "hexes", "clarity"]
  },
  royal: {
    adjectives: ["royal", "velvet", "crowned", "gilded", "fancy"],
    nouns: ["crown", "throne", "scepter", "velvet decree", "palace snack"],
    places: ["palace arcade", "velvet court", "crown booth"],
    verbs: ["decree", "collect", "parade", "duel", "polish"],
    players: ["Button Monarch", "Duchess Tiny", "Sir Velvet"],
    enemies: ["The Court Crank", "Tax Duke", "Drama Regent"],
    collectibles: ["crowns", "velvet decrees", "scepter sparks"],
    hazards: ["drama decrees", "slippery banquets", "tax trumpets"],
    motifs: ["tiny crowns", "velvet ropes", "banner lights"],
    sounds: ["royal ding", "scepter pop", "trumpet blip"],
    uiNouns: ["royal cart", "court board"],
    progress: ["crowns", "favor", "decrees"]
  },
  desert: {
    adjectives: ["sun-baked", "mirage", "cactus", "dusty", "golden"],
    nouns: ["cactus", "mirage", "dune", "canteen", "sand token"],
    places: ["mirage arcade", "cactus booth", "dune diner"],
    verbs: ["wander", "collect", "shade", "lasso", "discover"],
    players: ["Cactus Ranger", "Dune Button", "The Tiny Nomad"],
    enemies: ["Mirage Manager", "Dust Bill", "The Prickly Delay"],
    collectibles: ["cactus blooms", "water charms", "sun coins"],
    hazards: ["dust devils", "dry invoices", "prickly moods"],
    motifs: ["sun rays", "cactus dots", "dune lines"],
    sounds: ["canteen clink", "dune hush", "sun pop"],
    uiNouns: ["dune cart", "canteen board"],
    progress: ["blooms", "water", "miles"]
  },
  winter: {
    adjectives: ["frosty", "snow-soft", "blue-lit", "mittens-on", "glacial"],
    nouns: ["snow globe", "mittens", "ice bell", "frost token", "sled"],
    places: ["snow arcade", "frost booth", "glacier cafe"],
    verbs: ["slide", "collect", "warm", "skate", "defrost"],
    players: ["Mittens Pilot", "Frost Clerk", "The Tiny Sledder"],
    enemies: ["The Cold Snap", "Budget Blizzard", "Ice Invoice"],
    collectibles: ["snow globes", "warm sparks", "mittens"],
    hazards: ["ice patches", "cold snaps", "slippery bills"],
    motifs: ["snow dots", "frost lines", "warm windows"],
    sounds: ["ice chime", "snow puff", "mittens clap"],
    uiNouns: ["snow cart", "frost board"],
    progress: ["warmth", "globes", "mittens"]
  },
  arcade: {
    adjectives: ["neon", "token-fed", "pixel", "cabinet", "combo-ready"],
    nouns: ["token", "joystick", "cabinet", "high score", "bonus round"],
    places: ["token arcade", "cabinet row", "bonus booth"],
    verbs: ["score", "collect", "combo", "restart", "zap"],
    players: ["Joystick Kid", "Token Captain", "Button Runner"],
    enemies: ["The Continue Screen", "Coin Jam", "High Score Ghost"],
    collectibles: ["tokens", "bonus stars", "combo sparks"],
    hazards: ["coin jams", "tilt warnings", "fake jackpots"],
    motifs: ["pixels", "cabinet bulbs", "score flashes"],
    sounds: ["coin drop", "combo blip", "bonus ding"],
    uiNouns: ["cartridge", "cabinet"],
    progress: ["score", "tokens", "combo"]
  },
  noir: {
    adjectives: ["rain-slick", "smoky", "midnight", "jazz-lit", "shadowy"],
    nouns: ["fedora", "alley", "case", "streetlamp", "puddle"],
    places: ["jazz alley", "midnight diner", "streetlamp booth"],
    verbs: ["trail", "deduce", "collect", "vanish", "listen"],
    players: ["The Little Gumshoe", "Fedora Button", "Streetlamp Ace"],
    enemies: ["The Long Shadow", "Baron Puddle", "The Alibi"],
    collectibles: ["alibis", "streetlamp clues", "jazz notes"],
    hazards: ["red herrings", "slippery shadows", "late trains"],
    motifs: ["rain lines", "streetlamps", "case string"],
    sounds: ["jazz plink", "puddle tap", "case ding"],
    uiNouns: ["case cart", "evidence board"],
    progress: ["alibis", "clues", "truth"]
  },
  magical: {
    adjectives: ["spellbound", "wand-lit", "moon-sparked", "enchanted", "potion-pink"],
    nouns: ["wand", "potion", "spellbook", "familiar", "moon herb"],
    places: ["wizard garden", "potion arcade", "moon library"],
    verbs: ["cast", "brew", "collect", "charm", "spark"],
    players: ["Tiny Wizard", "Potion Sprout", "Wand Intern"],
    enemies: ["The Fizzing Hex", "Cauldron Deadline", "Grumpy Familiar"],
    collectibles: ["spells", "moon herbs", "potion bubbles"],
    hazards: ["miscast sparks", "cursed ladles", "fizz storms"],
    motifs: ["spell circles", "wand sparks", "moon herbs"],
    sounds: ["spell pop", "potion bloop", "wand chime"],
    uiNouns: ["spell cart", "potion tray"],
    progress: ["magic", "spells", "bloom"]
  },
  academic: {
    adjectives: ["library", "footnoted", "scholarly", "dusty", "quiz-ready"],
    nouns: ["book", "index card", "lecture", "library bell", "exam moon"],
    places: ["library arcade", "study booth", "after-hours stacks"],
    verbs: ["study", "collect", "cite", "decode", "debate"],
    players: ["Professor Button", "Index Card Kid", "The Tiny Scholar"],
    enemies: ["The Pop Quiz", "Citation Goblet", "Deadline Phantom"],
    collectibles: ["index cards", "footnotes", "library stamps"],
    hazards: ["pop quizzes", "late fees", "uncited claims"],
    motifs: ["book spines", "paper slips", "desk lamps"],
    sounds: ["page flip", "stamp thunk", "bell ding"],
    uiNouns: ["study cart", "index tray"],
    progress: ["notes", "citations", "wisdom"]
  },
  pirate: {
    adjectives: ["briny", "plundered", "map-marked", "gold-toothed", "stormy"],
    nouns: ["anchor", "treasure map", "deck", "captain hat", "coin chest"],
    places: ["deck arcade", "treasure booth", "storm tavern"],
    verbs: ["plunder", "chart", "collect", "parley", "sail"],
    players: ["Captain Button", "Map Gobbler", "The Tiny Buccaneer"],
    enemies: ["The Tax Kraken", "Mutiny Memo", "Captain Deadline"],
    collectibles: ["doubloons", "treasure maps", "anchor charms"],
    hazards: ["barnacle bills", "rude waves", "mutiny memos"],
    motifs: ["map marks", "rope loops", "coin shine"],
    sounds: ["coin clack", "anchor thunk", "wave whoop"],
    uiNouns: ["treasure cart", "map board"],
    progress: ["treasure", "maps", "bravery"]
  },
  robot: {
    adjectives: ["circuit", "beep-ready", "chrome", "calibrated", "friendly"],
    nouns: ["circuit", "bot", "battery", "antenna", "servo"],
    places: ["robot arcade", "charging booth", "circuit diner"],
    verbs: ["compute", "collect", "calibrate", "reboot", "sync"],
    players: ["Tiny Bot", "Servo Pal", "Captain Circuit"],
    enemies: ["The Low Battery", "Bug Report", "Dusty Drone"],
    collectibles: ["batteries", "clean signals", "servo stars"],
    hazards: ["bug reports", "loose magnets", "dust clouds"],
    motifs: ["circuit traces", "status lights", "antenna waves"],
    sounds: ["servo beep", "sync chirp", "battery ping"],
    uiNouns: ["circuit cart", "status board"],
    progress: ["charge", "signals", "calibration"]
  },
  forest: {
    adjectives: ["mossy", "fern-lit", "owl-soft", "rooty", "pine-scented"],
    nouns: ["moss", "owl bell", "fern", "stump", "acorn"],
    places: ["moss arcade", "fern hollow", "stump booth"],
    verbs: ["forage", "collect", "listen", "grow", "trail"],
    players: ["Moss Ranger", "Acorn Button", "The Fern Apprentice"],
    enemies: ["The Grumpy Stump", "Invoice Owl", "Mildew Baron"],
    collectibles: ["acorns", "fern charms", "moss sparks"],
    hazards: ["root trips", "mildew coupons", "lost trails"],
    motifs: ["leaf shadows", "fern fronds", "acorn dots"],
    sounds: ["leaf hush", "acorn bonk", "owl blink"],
    uiNouns: ["forest cart", "moss board"],
    progress: ["acorns", "trail", "growth"]
  },
  dream: {
    adjectives: ["dreamy", "cloud-soft", "moon-melted", "sleepy", "lucid"],
    nouns: ["cloud", "moon pillow", "sleep token", "floating door", "dream snack"],
    places: ["cloud arcade", "nap booth", "moon hallway"],
    verbs: ["float", "collect", "remember", "drift", "decode"],
    players: ["Nap Captain", "Cloud Button", "The Lucid Intern"],
    enemies: ["The Alarm Clock", "Floating Homework", "Snackless Moon"],
    collectibles: ["dream snacks", "moon pillows", "cloud keys"],
    hazards: ["alarm clocks", "melty stairs", "floating paperwork"],
    motifs: ["cloud wisps", "moon dots", "sleepy stars"],
    sounds: ["dream plink", "moon hum", "cloud puff"],
    uiNouns: ["dream cart", "nap board"],
    progress: ["dreams", "memories", "cloud keys"]
  },
  "horror-lite": {
    adjectives: ["soft-scary", "flashlight", "friendly-creepy", "goosebumpy", "not-too-doomed"],
    nouns: ["flashlight", "monster mask", "basement bell", "shadow snack", "blanket fort"],
    places: ["blanket fort crypt", "flashlight arcade", "basement booth"],
    verbs: ["brave", "collect", "illuminate", "sneak", "giggle at"],
    players: ["Flashlight Kid", "Blanket Knight", "The Brave Intern"],
    enemies: ["The Under-Bed Maybe", "Creaky Door", "Snackless Shadow"],
    collectibles: ["flashlight batteries", "brave crumbs", "monster stickers"],
    hazards: ["creaky doors", "shadow socks", "jump coupons"],
    motifs: ["flashlight cones", "soft shadows", "sticker monsters"],
    sounds: ["flash click", "boo plink", "blanket rustle"],
    uiNouns: ["flashlight cart", "bravery board"],
    progress: ["bravery", "batteries", "stickers"]
  }
};

export function mergeCopy(signals: VibeSignal[]): SignalCopy {
  return signals.reduce<SignalCopy>(
    (merged, signal) => {
      const copy = signalCopy[signal];
      return {
        adjectives: [...merged.adjectives, ...(copy.adjectives ?? [])],
        nouns: [...merged.nouns, ...(copy.nouns ?? [])],
        places: [...merged.places, ...(copy.places ?? [])],
        verbs: [...merged.verbs, ...(copy.verbs ?? [])],
        players: [...merged.players, ...(copy.players ?? [])],
        enemies: [...merged.enemies, ...(copy.enemies ?? [])],
        collectibles: [...merged.collectibles, ...(copy.collectibles ?? [])],
        hazards: [...merged.hazards, ...(copy.hazards ?? [])],
        motifs: [...merged.motifs, ...(copy.motifs ?? [])],
        sounds: [...merged.sounds, ...(copy.sounds ?? [])],
        uiNouns: [...merged.uiNouns, ...(copy.uiNouns ?? [])],
        progress: [...merged.progress, ...(copy.progress ?? [])]
      };
    },
    { ...baseCopy }
  );
}

export const patchNoteTemplates = [
  "Buffed {collectiblePlural} by {percent}%.",
  "Reduced {hazardName} from {oldCount} to {newCount}.",
  "Fixed a bug where the moon kept asking for snacks.",
  "Added emotional support {noun}.",
  "Nerfed {enemyName}, accidentally buffed {collectiblePlural}.",
  "Improved {place} lighting for suspiciously small victories.",
  "Adjusted {soundLabel} volume after one dramatic complaint.",
  "Made {playerName} {percent}% more committed to the bit."
];

export const subtitles = [
  "A microgame about urgent tiny nonsense.",
  "One screen. One vibe. Several questionable choices.",
  "A playable cartridge from the after-hours cabinet.",
  "An arcade snack with deterministic seasoning.",
  "Small enough to finish, weird enough to remember."
];

export const boxTaglines = [
  "Plays in a minute, haunts your backlog.",
  "No cloud. All nonsense.",
  "Certified pocket chaos.",
  "Insert vibe to continue.",
  "A tiny cabinet with big opinions.",
  "Offline weirdness, freshly generated."
];

export const boxIcons = [
  "diamond",
  "spark",
  "moon",
  "key",
  "star",
  "crown",
  "bolt",
  "leaf",
  "eye",
  "coin"
];

