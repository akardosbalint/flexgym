import { ImageResponse } from "next/og";

export const alt = "Forge Gym Budapest — kovácsold magad legendává!";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
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
          background: "#0b0b0c",
          backgroundImage:
            "radial-gradient(circle at 50% 0%, rgba(224,18,31,0.35) 0%, transparent 60%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 84,
              height: 84,
              borderRadius: 14,
              background: "#e0121f",
              color: "#ffffff",
              fontSize: 52,
              fontWeight: 700,
            }}
          >
            F
          </div>
          <div style={{ display: "flex", fontSize: 72, fontWeight: 700, color: "#f7f7f8" }}>
            FORGE <span style={{ color: "#ff2e3d", marginLeft: 18 }}>GYM</span>
          </div>
        </div>
        <div style={{ display: "flex", marginTop: 28, fontSize: 32, color: "#a3a3ab" }}>
          Kovácsold magad legendává. — Budapest
        </div>
      </div>
    ),
    { ...size },
  );
}
