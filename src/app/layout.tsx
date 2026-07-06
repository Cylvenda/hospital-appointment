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
  title: {
    default: "Digital Patient Pre-Registration and Appointment Management System",
    template: "%s | DPAMS",
  },
  icons: {
    icon: "/meeet.webp",
  },
  description:
    "A secure and efficient system for managing patient appointments, doctors, and hospital workflows.",
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
