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

export function portraitProvider(mail, size) {
  return `https://seccdn.libravatar.org/avatar/${md5(mail.trim().toLowerCase()).toString()}?s=${size}&d=retro`;
}

export function generateIdentity(text, size = 8) {
  return sha256(text).toString().substring(0, size);
}
