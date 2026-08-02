"use client";

import { useEffect, useState } from "react";
import { RefreshCw, Stethoscope, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OfflinePage() {
  const [online, setOnline] = useState(() => typeof navigator !== "undefined" && navigator.onLine);

  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  return (
    <main className="grid min-h-dvh place-items-center bg-gradient-to-b from-emerald-50 to-background px-6 dark:from-emerald-950/30">
      <section className="w-full max-w-lg text-center" aria-live="polite">
        <div className="relative mx-auto mb-8 flex size-40 items-center justify-center rounded-full bg-emerald-100 text-primary dark:bg-emerald-900/40" aria-hidden="true">
          <Stethoscope className="size-20" strokeWidth={1.5} />
          <span className="absolute right-2 bottom-3 grid size-12 place-items-center rounded-full bg-background shadow-lg">
            {online ? <Wifi className="size-6" /> : <WifiOff className="size-6" />}
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{online ? "Connection restored" : "No Internet Connection"}</h1>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          {online ? "You’re back online. Retry to continue to DPAMS." : "We can’t reach DPAMS right now. Previously loaded public pages may still be available; protected medical data is never stored by the app cache."}
        </p>
        <Button className="mt-8" size="lg" onClick={() => window.location.reload()} aria-label="Retry loading DPAMS">
          <RefreshCw aria-hidden="true" /> Retry
        </Button>
      </section>
    </main>
  );
}
