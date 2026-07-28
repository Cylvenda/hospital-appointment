import type { Metadata } from "next";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider } from "@/components/theme-provider";
import { AuthBootstrap } from "@/components/auth-bootstrap";
import { NotificationBootstrap } from "@/components/notification-bootstrap";
import { LanguageBootstrap } from "@/components/language-bootstrap";
import { cn } from "@/lib/utils";
import { Poppins, Inter } from "next/font/google";


const inter = Inter({subsets:['latin'],variable:'--font-sans'});

// Configure Poppins
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700"], // optional: 400=regular, 500=medium, 700=bold
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dpams.vercel.app"),
  title: {
    default: "Digital Patient Pre-Registration and Appointment Management System",
    template: "%s | DPAMS",
  },
  description:
    "A secure and efficient system for managing patient appointments, doctors, and hospital workflows.",
  applicationName: "DPAMS",
  keywords: [
    "DPAMS",
    "patient registration",
    "hospital appointments",
    "healthcare management",
    "Tanzania healthcare",
  ],
  authors: [{ name: "DPAMS" }],
  creator: "DPAMS",
  publisher: "DPAMS",
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/meeet.webp",
    apple: "/meeet.webp",
    other: [
      { rel: "icon", type: "image/webp", sizes: "32x32", url: "/meeet.webp" },
      { rel: "icon", type: "image/webp", sizes: "16x16", url: "/meeet.webp" },
    ],
  },
  alternates: { canonical: "/" },
  openGraph: {
    title: "Digital Patient Pre-Registration and Appointment Management System",
    description:
      "A secure and efficient system for managing patient appointments, doctors, and hospital workflows.",
    url: "https://dpams.vercel.app",
    siteName: "DPAMS",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "DPAMS patient registration and appointment management",
        type: "image/png",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DPAMS - Digital Patient Pre-Registration and Appointment Management System",
    description:
      "A secure and efficient system for managing patient appointments, doctors, and hospital workflows.",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning className={cn("h-full antialiased", poppins.variable, "font-sans", inter.variable)}
    >
      <head />
      <body className="min-h-screen bg-background text-foreground font-sans">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar
          newestOnTop
          pauseOnHover
          theme="colored"
        />

        <div className="flex min-h-screen flex-col">
          <main className="flex-1">
            <ThemeProvider>
               <TooltipProvider>
                 <LanguageBootstrap />
                 <AuthBootstrap />
                 <NotificationBootstrap />
                 {children}
               </TooltipProvider>
            </ThemeProvider>
          </main>
        </div>
      </body>
    </html>
  );
}
