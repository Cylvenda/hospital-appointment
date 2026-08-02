"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Download, RefreshCw, WifiOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isStandalone, registerServiceWorker, type BeforeInstallPromptEvent } from "@/lib/pwa/register";

export function PWAProvider() {
  const pathname = usePathname();
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [online, setOnline] = useState(true);
  const [updateReady, setUpdateReady] = useState(false);
  const [iosHelp, setIosHelp] = useState(false);
  const showInstallOnRoute = pathname === "/" || [
    "/login",
    "/register",
    "/reset",
    "/activate/",
    "/password/reset/",
  ].some((route) => pathname.startsWith(route));

  useEffect(() => {
    // Defer browser-state synchronization so the server render stays deterministic.
    queueMicrotask(() => {
      setOnline(navigator.onLine);
      setInstalled(isStandalone());
    });
    if (navigator.serviceWorker?.controller) {
      sessionStorage.setItem("dpams-sw-controlled", "true");
    }
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    const onInstall = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };
    const onInstalled = () => { setInstalled(true); setInstallEvent(null); };
    const onController = () => {
      if (sessionStorage.getItem("dpams-sw-controlled")) setUpdateReady(true);
      sessionStorage.setItem("dpams-sw-controlled", "true");
    };
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    window.addEventListener("beforeinstallprompt", onInstall);
    window.addEventListener("appinstalled", onInstalled);
    navigator.serviceWorker?.addEventListener("controllerchange", onController);
    let updateTimer: ReturnType<typeof setInterval> | undefined;
    registerServiceWorker().then((registration) => {
      if (!registration) return;
      void registration.update();
      updateTimer = setInterval(() => void registration.update(), 60 * 60 * 1000);
    }).catch(() => undefined);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("beforeinstallprompt", onInstall);
      window.removeEventListener("appinstalled", onInstalled);
      navigator.serviceWorker?.removeEventListener("controllerchange", onController);
      if (updateTimer) clearInterval(updateTimer);
    };
  }, []);

  const install = async () => {
    if (installEvent) {
      await installEvent.prompt();
      const { outcome } = await installEvent.userChoice;
      if (outcome === "accepted") setInstallEvent(null);
      return;
    }
    if (/iphone|ipad|ipod/i.test(navigator.userAgent)) setIosHelp(true);
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4" aria-live="polite">
      {!online && <div role="status" className="pointer-events-auto flex items-center gap-2 rounded-full bg-amber-950 px-4 py-2 text-sm font-medium text-white shadow-lg"><WifiOff className="size-4" /> Offline — information may be out of date</div>}
      {updateReady && <div role="status" className="pointer-events-auto flex max-w-md items-center gap-3 rounded-xl border bg-background p-3 shadow-xl"><span className="text-sm">A new version is available.</span><Button size="sm" onClick={() => window.location.reload()}><RefreshCw /> Update</Button><Button size="icon-sm" variant="ghost" aria-label="Dismiss update notice" onClick={() => setUpdateReady(false)}><X /></Button></div>}
      {showInstallOnRoute && !installed && (installEvent || /iphone|ipad|ipod/i.test(typeof navigator === "undefined" ? "" : navigator.userAgent)) && <div className="pointer-events-auto self-end rounded-xl border bg-background p-3 shadow-xl"><div className="flex items-center gap-3"><span className="text-sm font-medium">Install DPAMS for faster access</span><Button size="sm" onClick={install}><Download /> Install</Button></div>{iosHelp && <p className="mt-2 max-w-xs text-xs text-muted-foreground">On iPhone or iPad, tap Share, then “Add to Home Screen”.</p>}</div>}
    </div>
  );
}
