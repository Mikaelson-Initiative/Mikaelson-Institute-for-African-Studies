// Network Information API — Chromium only, absent elsewhere (Safari, Firefox).
// Absence means "unknown," not "fast": only report slow when it's actually
// reported slow, never gate on the feature being unsupported.
type NetworkInformation = { saveData?: boolean; effectiveType?: string };

export function isSlowConnection(): boolean {
  const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  if (!connection) return false;
  if (connection.saveData) return true;
  return connection.effectiveType === "slow-2g" || connection.effectiveType === "2g";
}
