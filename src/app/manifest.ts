import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "DPAMS Hospital Appointment Management",
    short_name: "DPAMS",
    description: "Secure patient pre-registration and hospital appointment management.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#f8fcf9",
    theme_color: "#178444",
    lang: "en-TZ",
    categories: ["medical", "health", "productivity"],
    icons: [72, 96, 128, 144, 152, 192, 384, 512].flatMap((size) => [
      { src: `/icons/icon-${size}x${size}.png`, sizes: `${size}x${size}`, type: "image/png", purpose: "any" as const },
      ...(size === 192 || size === 512
        ? [{ src: `/icons/maskable-icon-${size}x${size}.png`, sizes: `${size}x${size}`, type: "image/png", purpose: "maskable" as const }]
        : []),
    ]),
    screenshots: [
      { src: "/screenshots/dashboard-wide.png", sizes: "1280x720", type: "image/png", form_factor: "wide", label: "DPAMS appointment dashboard" },
      { src: "/screenshots/dashboard-mobile.png", sizes: "750x1334", type: "image/png", form_factor: "narrow", label: "DPAMS mobile appointment experience" },
    ],
  };
}
