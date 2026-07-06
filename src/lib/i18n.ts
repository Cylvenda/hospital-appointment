import enMessages from "../messages/en.json"
import swMessages from "../messages/sw.json"
import { useLanguageStore } from "@/store/language/language.store"
import type { Language } from "@/store/language/language.store"

const messages = {
  en: enMessages,
  sw: swMessages,
}

export type TranslationKey = keyof typeof enMessages | string

function resolveTranslation(key: string, language: Language) {
  const keys = key.split(".")
  let value: unknown = messages[language]

  for (const k of keys) {
    if (typeof value !== "object" || value === null || !(k in value)) {
      return undefined
    }
    value = (value as Record<string, unknown>)[k]
  }

  return typeof value === "string" ? value : undefined
}

function humanizeTranslationKey(key: string) {
  const label = key
    .split(".")
    .at(-1)
    ?.replace(/\$\{[^}]+\}/g, "")
    .replace(/[_-]+/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/\bDesc\b/g, "Description")
    .replace(/\bId\b/g, "ID")
    .replace(/\bDob\b/g, "Date of Birth")
    .replace(/\bPdf\b/g, "PDF")
    .replace(/\bDocx\b/g, "DOCX")
    .replace(/\bTzs\b/g, "TZS")
    .replace(/\bNa\b/g, "N/A")
    .trim()

  if (!label) return "Translation unavailable"
  return label.charAt(0).toUpperCase() + label.slice(1)
}

export function getTranslationValue(
  key: string,
  language: Language,
  params?: Record<string, string | number>
) {
  const fallbackLanguage: Language = language === "sw" ? "en" : "en"
  const value =
    resolveTranslation(key, language) ??
    (fallbackLanguage !== language
      ? resolveTranslation(key, fallbackLanguage)
      : undefined) ??
    humanizeTranslationKey(key)

  if (params) {
    return Object.entries(params).reduce(
      (str, [param, replacement]) => str.replace(`{{${param}}}`, String(replacement)),
      value
    )
  }

  return value
}

export function useTranslation() {
  const { language } = useLanguageStore()

  const t = (key: string, params?: Record<string, string | number>) => {
    return getTranslationValue(key, language, params)
  }

  return { t, language }
}
