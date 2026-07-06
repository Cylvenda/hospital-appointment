"use client"

import { useEffect } from "react"
import { useLanguageStore } from "@/store/language/language.store"

export function LanguageBootstrap() {
  const language = useLanguageStore((state) => state.language)

  useEffect(() => {
    document.documentElement.lang = language === "sw" ? "sw" : "en"
  }, [language])

  return null
}
