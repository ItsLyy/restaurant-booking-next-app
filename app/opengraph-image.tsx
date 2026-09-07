import { ImageResponse } from "next/og";

export const alt = "RES.BOOK — Book tables at the best restaurants";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 80px",
          background: "#f7f3ef",
          color: "#2b2118",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 120,
            fontWeight: 700,
            letterSpacing: "0.04em",
          }}
        >
          RES.BOOK
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 36,
            color: "#7b3f20",
            marginTop: 24,
          }}
        >
          Discover and book tables at the best restaurants in your area.
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}