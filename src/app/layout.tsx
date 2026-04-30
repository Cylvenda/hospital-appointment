import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ToastContainer } from "react-toastify";
import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider } from "@/components/theme-provider";
import { AuthBootstrap } from "@/components/auth-bootstrap";
import { NotificationBootstrap } from "@/components/notification-bootstrap";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Patient Appointment Management System",
    template: "%s | PAMS",
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
      suppressHydrationWarning
      className={cn("h-full antialiased", poppins.variable)}
    >
      <head />
      <body
        className={cn(
          "min-h-screen bg-gray-50 text-gray-900 font-sans",
          poppins.className
        )}
      >
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
