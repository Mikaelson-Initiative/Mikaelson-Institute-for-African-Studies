import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const logoData = await readFile(
    join(process.cwd(), "public/logos/png/mark-primary-dark-on-teal-512.png"),
  );
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 32,
          backgroundColor: "#003E45",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={160} height={160} alt="" />
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: "#E9E1D8",
            textAlign: "center",
            maxWidth: 900,
          }}
        >
          Mikaelson Institute for African Studies
        </div>
        <div style={{ fontSize: 28, color: "#5CE1E6" }}>
          Pan-African scholarship — history, society, arts, philosophy
        </div>
      </div>
    ),
    { ...size },
  );
}
