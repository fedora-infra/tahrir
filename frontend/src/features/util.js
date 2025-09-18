import md5 from "crypto-js/md5";
import sha256 from "crypto-js/sha256";

export function formatTime(epochTime) {
  const date = new Date(epochTime * 1000);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

export function portraitProvider(mail, size = 40) {
  return `https://seccdn.libravatar.org/avatar/${md5(mail.trim().toLowerCase()).toString()}?s=${size}&d=retro`;
}

export function generateIdentity(text, size = 8) {
  return sha256(text).toString().substring(0, size);
}

// See https://github.com/fedora-infra/tahrir/pull/720#issuecomment-3307684713
export const mainColors = {
  "Legacy Blue": "#294172", // ORIGIN [0]
  "Modern Blue": "#3D7AA8", // DARKER [-1]
  "Deep Blue": "#2D5387", // DARKER [-1]
  "Freedom Pink": "#6E5685", // DARKER [-1]
  "Friends Magenta": "#B32963", // DARKER [-1]
  "Features Orange": "#AC721E", // DARKER [-1]
  "First Green": "#589F25", // DARKER [-1]
  "Gridhead Teal": "#008080", // ORIGIN [0]
};

// COLORS DERIVED FROM GENSHIN IMPACT
export const rareColors = {
  X: "#51A2DA",
  S: "#C3A27F",
  A: "#AB94C0",
  B: "#7CA0B4",
  C: "#7F9A8C",
  D: "#90989E",
};

export const rarities = {
  X: "Fedorable",
  S: "Legendary",
  A: "Epic",
  B: "Rare",
  C: "Uncommon",
  D: "Common",
};

export function obtainRarityBack(rarity) {
  if (!rarity) return "";
  return `rarity-${rarity.toLowerCase()}-bg`;
}

export function obtainRarityText(rarity) {
  if (!rarity) return "";
  return `rarity-${rarity.toLowerCase()}-text`;
}

export function obtainRarityEdge(rarity) {
  if (!rarity) return "";
  return `rarity-${rarity.toLowerCase()}-border`;
}
