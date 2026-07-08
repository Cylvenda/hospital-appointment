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
