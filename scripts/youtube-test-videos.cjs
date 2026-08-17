// Dev/test-only reference list — NOT wired into any seed script or migration.
// These are real, public, currently-embeddable YouTube videos (each verified
// via YouTube's own oEmbed endpoint: a 200 response with valid embed HTML
// means the video exists, is public, and allows embedding — a private,
// deleted, or embedding-disabled video returns an error instead).
//
// Verified 2026-08-16 with:
//   curl "https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=<ID>&format=json"
//
// Paste any of these `id` values into a Module's `videoId` field (with
// `videoProvider: "youtube"`) via Prisma Studio to try the player. Swap in
// your own real lecture video's ID the same way once you have one — just
// confirm it's Public or Unlisted (Private videos will fail to embed).
module.exports = [
  {
    id: "jNQXAC9IVRw",
    title: "Me at the zoo",
    note: "The first video ever uploaded to YouTube. ~19 seconds — good for testing the 'short video' case.",
  },
  {
    id: "aqz-KE-bpKQ",
    title: "Big Buck Bunny 60fps 4K (Official Blender Foundation Short Film)",
    note: "Normal-length landscape video, openly licensed Creative Commons short film — good for testing standard playback (play/pause/seek/fullscreen).",
  },
  {
    id: "_OBlgSz8sSM",
    title: "Charlie bit my finger - again!",
    note: "Short, well-known, explicitly confirmed embeddable — good general-purpose second test case.",
  },
];
