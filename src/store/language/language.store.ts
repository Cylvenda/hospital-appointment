import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Language = "en" | "sw"

type LanguageState = {
  language: Language
  setLanguage: (language: Language) => void
  toggleLanguage: () => void
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: "en", // Default to English
      setLanguage: (language: Language) => set({ language }),
      toggleLanguage: () => {
        const currentLanguage = get().language
        set({ language: currentLanguage === "en" ? "sw" : "en" })
      },
    }),
    {
      name: "language-storage", // Storage key
    }
  )
)
