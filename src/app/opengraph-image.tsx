import { ImageResponse } from "next/og"

export const alt = "DPAMS patient registration and appointment management"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          color: "#172019",
          background:
            "linear-gradient(135deg, #fbfdfb 0%, #f2f8f2 58%, #e8f4e9 100%)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 520,
            height: 520,
            borderRadius: 999,
            right: -130,
            top: -190,
            background: "rgba(47, 143, 70, 0.12)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 360,
            height: 360,
            borderRadius: 999,
            right: 100,
            bottom: -240,
            background: "rgba(47, 143, 70, 0.08)",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px 74px",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <div
              style={{
                width: 86,
                height: 86,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 26,
                color: "#ffffff",
                background: "#2f8f46",
                boxShadow: "0 18px 50px rgba(47, 143, 70, 0.22)",
                fontSize: 32,
                fontWeight: 800,
              }}
            >
              DP
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  color: "#2f8f46",
                  fontSize: 34,
                  fontWeight: 800,
                  letterSpacing: "0.16em",
                }}
              >
                DPAMS
              </div>
              <div style={{ color: "#66746a", fontSize: 20, marginTop: 5 }}>
                Digital healthcare, organized around the patient
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", maxWidth: 890 }}>
            <div
              style={{
                fontSize: 61,
                lineHeight: 1.08,
                fontWeight: 800,
                letterSpacing: "-0.035em",
              }}
            >
              Patient registration and appointments made simple.
            </div>
            <div
              style={{
                color: "#58655c",
                fontSize: 25,
                lineHeight: 1.4,
                marginTop: 25,
              }}
            >
              Securely manage appointments, doctors, clinical visits, payments,
              and hospital workflows in one place.
            </div>
          </div>

          <div style={{ display: "flex", gap: 14 }}>
            {["Pre-registration", "Appointments", "Clinical workflow"].map(
              (label) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    padding: "11px 19px",
                    border: "1px solid rgba(47,143,70,0.2)",
                    borderRadius: 999,
                    color: "#276f39",
                    background: "rgba(47,143,70,0.08)",
                    fontSize: 17,
                  }}
                >
                  {label}
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    ),
    size,
  )
}
