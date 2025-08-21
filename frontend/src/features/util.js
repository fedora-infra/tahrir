import md5 from "crypto-js/md5";

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

export function PortraitProvider(mail) {
  return `https://seccdn.libravatar.org/avatar/${md5(mail.trim().toLowerCase()).toString()}?s=40&d=retro`;
}

export async function HTTPCall(method, path) {
  const response = await fetch(path, {
    method: method,
  });
  if (!response.ok) {
    const expt = (await response.json()).detail;
    throw new Error(`${response.status}: ${expt}`, { cause: response });
  }
  const data = await response.json();
  return data;
}
