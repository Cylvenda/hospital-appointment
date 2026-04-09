export function getDashboardPath(role?: string | null): string {
     if (role === "admin") return "/dashboard"
     if (role === "receptionist") return "/receptionist-dashboard"
     if (role === "patient") return "/patient-dashboard"
     if (role === "doctor") return "/appointments"
     return "/login"
}
