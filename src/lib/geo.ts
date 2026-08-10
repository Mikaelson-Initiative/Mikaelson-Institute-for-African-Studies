import { Vector3 } from "three";

/**
 * Standard lat/long → Cartesian conversion for placing a point on a sphere's
 * surface. Longitude 0° faces +Z; this only needs to be internally
 * consistent since the globe carries no texture with a fixed "front."
 */
export function latLongToVector3(lat: number, lon: number, radius: number): Vector3 {
  const latRad = (lat * Math.PI) / 180;
  const lonRad = (lon * Math.PI) / 180;

  const x = radius * Math.cos(latRad) * Math.sin(lonRad);
  const y = radius * Math.sin(latRad);
  const z = radius * Math.cos(latRad) * Math.cos(lonRad);

  return new Vector3(x, y, z);
}
