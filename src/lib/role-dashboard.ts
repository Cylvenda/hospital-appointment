export function getDashboardPath(role?: string | null): string {
     if (role === "admin") return "/dashboard"
     if (role === "receptionist") return "/receptionist-dashboard"
     if (role === "patient") return "/patient-dashboard"
     if (role === "doctor") return "/doctor-dashboard"
     return "/login"
}

export function getNotificationsPath(role?: string | null): string {
     if (role === "admin") return "/notifications"
     if (role === "receptionist") return "/receptionist-dashboard/notifications"
     if (role === "patient") return "/patient-dashboard/notifications"
     if (role === "doctor") return "/doctor-dashboard/notifications"
     return "/login"
}

export function getAppointmentsPath(role?: string | null): string {
     if (role === "admin") return "/appointments/all"
     if (role === "receptionist") return "/receptionist-dashboard/appointments/all"
     if (role === "patient") return "/patient-dashboard/appointments/all"
     if (role === "doctor") return "/doctor-dashboard/appointments/all"
     return "/login"
}
