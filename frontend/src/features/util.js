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
