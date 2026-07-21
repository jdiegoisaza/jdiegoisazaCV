import { ImageResponse } from "next/og";
import { perfil } from "@/app/data/cv.mjs";

export const alt = "Juan Diego Isaza Londoño — Especialista DevSecOps";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "90px",
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            width: 110,
            height: 110,
            borderRadius: "9999px",
            background: "linear-gradient(to bottom right, #2563eb, #60a5fa)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 44,
            fontWeight: 700,
            color: "white",
            marginBottom: 44,
          }}
        >
          JD
        </div>
        <div style={{ display: "flex", fontSize: 60, fontWeight: 700, color: "white" }}>
          {perfil.nombre}
        </div>
        <div style={{ display: "flex", fontSize: 32, color: "#93c5fd", marginTop: 18 }}>
          {perfil.titulo}
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "#cbd5e1", marginTop: 32 }}>
          Azure DevOps · DevSecOps · Terraform · CI/CD
        </div>
      </div>
    ),
    { ...size }
  );
}
