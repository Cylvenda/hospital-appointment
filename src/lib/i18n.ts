import enMessages from "../messages/en.json"
import swMessages from "../messages/sw.json"
import { useLanguageStore } from "@/store/language/language.store"

const messages = {
  en: enMessages,
  sw: swMessages,
}

export type TranslationKey = keyof typeof enMessages | string

export function useTranslation() {
  const { language } = useLanguageStore()

  const t = (key: string, params?: Record<string, string | number>) => {
    const keys = key.split(".")
    let value: any = messages[language]

    for (const k of keys) {
      value = value?.[k]
    }

    if (typeof value !== "string") {
      console.warn(`Translation key "${key}" not found for language "${language}"`)
      return key
    }

    // Replace parameters in the translation string
    if (params) {
      return Object.entries(params).reduce(
        (str, [param, replacement]) => str.replace(`{{${param}}}`, String(replacement)),
        value
      )
    }

    return value
  }

  return { t, language }
}
