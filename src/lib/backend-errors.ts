import axios from "axios";

export type BackendFieldErrors = Record<string, string>;

export function getBackendFieldErrors<T extends string>(
  error: unknown,
  fields: T[],
) {
  if (!axios.isAxiosError(error)) {
    return {} as Record<T, string>;
  }

  const data = error.response?.data;
  if (!data || typeof data !== "object") {
    return {} as Record<T, string>;
  }

  return fields.reduce(
    (acc, field) => {
      const value = (data as Record<string, unknown>)[field];
      if (typeof value === "string") {
        acc[field] = value;
      } else if (Array.isArray(value) && value.length > 0) {
        const first = value[0];
        acc[field] = typeof first === "string" ? first : String(first);
      }
      return acc;
    },
    {} as Record<T, string>,
  );
}

export function getBackendErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data && typeof data === "object") {
      const record = data as Record<string, unknown>;
      const nonField = record.non_field_errors;
      if (Array.isArray(nonField) && nonField.length > 0) {
        const first = nonField[0];
        if (typeof first === "string") return first;
        return String(first);
      }
      const detail = record.detail;
      if (typeof detail === "string") return detail;
      if (Array.isArray(detail) && detail.length > 0) {
        const first = detail[0];
        if (typeof first === "string") return first;
        return String(first);
      }
    }
  } else if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}
