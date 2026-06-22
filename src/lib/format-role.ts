export function formatRoleLabel(role?: string | null): string {
     if (!role) return "User"

     return role
          .replace(/[_-]+/g, " ")
          .trim()
          .split(/\s+/)
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" ")
}
