export const PWA_MESSAGE = {
  skipWaiting: "SKIP_WAITING",
  clearPrivateData: "CLEAR_PRIVATE_DATA",
} as const;

export function clearPwaCaches() {
  navigator.serviceWorker.controller?.postMessage({ type: PWA_MESSAGE.clearPrivateData });
}
