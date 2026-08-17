// YouTube video IDs are always exactly 11 URL-safe characters. This is a
// cheap sanity check on data that only ever comes from Prisma Studio right
// now (no admin authoring UI exists yet) — catches an obviously-malformed
// ID (a pasted full watch URL, a typo) before we hand it to the player.
const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

export function isValidYouTubeId(value: string): boolean {
  return YOUTUBE_ID_PATTERN.test(value);
}
