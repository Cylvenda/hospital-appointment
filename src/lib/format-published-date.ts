export function formatPublishedDate(
  publishedAt?: string | null,
  createdAt?: string | null,
  options?: Intl.DateTimeFormatOptions,
  locale = "en-US",
  recentLabel = "Recently published"
) {
  const parseDate = (value?: string | null) => {
    if (!value) return null
    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }

  const isSuspiciousYear = (date: Date) => date.getFullYear() < 2000

  const publishedDate = parseDate(publishedAt)
  if (publishedDate && !isSuspiciousYear(publishedDate)) {
    return options ? publishedDate.toLocaleDateString(locale, options) : publishedDate.toLocaleDateString(locale)
  }

  const createdDate = parseDate(createdAt)
  if (createdDate && !isSuspiciousYear(createdDate)) {
    return options ? createdDate.toLocaleDateString(locale, options) : createdDate.toLocaleDateString(locale)
  }

  return recentLabel
}
