// Mapeamento de IDs de emojis para seus valores
export const emojiMap: Record<string, string> = {
  // Profissões/Classes
  knight: "⚔️",
  wizard: "🧙",
  shield: "🛡️",
  crown: "👑",
  bow: "🏹",
  sword: "🗡️",
  lightning: "⚡",
  crystal: "🔮",
  star: "🌟",
  lion: "🦁",
  dragon: "🐉",
  person: "👤",

  // Habilidades/Temas
  math: "📐",
  book: "📚",
  react: "⚛️",
  test: "🧪",
  science: "🧬",
  world: "🌍",
  code: "💻",
  art: "🎨",
  music: "🎵",
  soccer: "⚽",
  run: "🏃",
  notes: "📝",

  // Ações/Estados
  quest: "🎯",
  tasks: "📚",
  rewards: "🎁",
  celebration: "🎉",
  lock: "🔒",
  sparkle: "✨",
  gaming: "🎮",
  scroll: "📜",

  // Gamificação
  trophy: "🏆",
  coins: "🪙",
  xp: "⭐",
  level: "🎖️",
  achievement: "🏅",
};

// Função auxiliar para obter emoji pelo ID
export const getEmoji = (emojiId: string): string => {
  return emojiMap[emojiId] || "❓";
};

// Função auxiliar para obter ID pelo emoji (busca reversa)
export const getEmojiId = (emoji: string): string | undefined => {
  return Object.entries(emojiMap).find(([, val]) => val === emoji)?.[0];
};

// Array de IDs para uso em seletores
export const commonEmojiIds = [
  "math",
  "book",
  "react",
  "test",
  "science",
  "world",
  "code",
  "art",
  "music",
  "soccer",
  "run",
  "notes",
];

// Array de IDs para avatares
export const avatarEmojiIds = [
  "person",
  "wizard",
  "knight",
  "shield",
  "crown",
  "bow",
  "sword",
  "lightning",
  "crystal",
  "star",
  "lion",
  "dragon",
];
