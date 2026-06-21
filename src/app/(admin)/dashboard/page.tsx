"use client"

import { useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  AlertCircleIcon,
  CalendarCheckIn01Icon,
  Clock03Icon,
  Doctor01Icon,
  MoreHorizontalIcon,
  StethoscopeIcon,
  UserCheck01Icon,
  UserGroupIcon,
  RefreshIcon,
  ArrowRight01Icon,
  CheckCircle,
  Calendar03Icon
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useAdminStore } from "@/store/admin/admin.store"
import { useAppointmentStore } from "@/store/appointments/appointment.store"
import { AppointmentWorkflowLegend } from "@/components/appointment-workflow-legend"
import { getAppointmentStatusMeta } from "@/lib/appointment-workflow"
import { filterAppointmentsForQueue } from "@/lib/appointment-queues"
import { cn } from "@/lib/utils"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
}

function toneClasses(tone: string) {
  switch (tone) {
    case "emerald":
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
    case "amber":
      return "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
    case "rose":
      return "bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"
    default:
      return "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300"
  }
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const { overview, doctors, users, fetchOverview, fetchDoctors, fetchUsers } = useAdminStore()
  const { appointments, initialize: initializeAppointments, loading: appointmentsLoading } = useAppointmentStore()

  useEffect(() => {
    void fetchOverview()
    void fetchDoctors()
    void fetchUsers({ role: "patient" })
    void initializeAppointments()
  }, [fetchDoctors, fetchOverview, fetchUsers, initializeAppointments])

  const stats = useMemo(
    () => [
      {
        title: "Today's Visits",
        value: filterAppointmentsForQueue(appointments, "admin", "daily-schedule").length || (overview?.today_appointments ?? 0),
        note: "Scheduled for today",
        icon: CalendarCheckIn01Icon,
        color: "text-blue-600",
        bg: "bg-blue-50",
      },
      {
        title: "Checked In",
        value: overview?.approved_appointments ?? 0,
        note: `${overview?.pending_appointments ?? 0} waiting`,
        icon: UserCheck01Icon,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
      },
      {
        title: "Staff On Duty",
        value: doctors.filter((d) => d.is_available).length,
        note: `${doctors.length} total specialists`,
        icon: StethoscopeIcon,
        color: "text-indigo-600",
        bg: "bg-indigo-50",
      },
      {
        title: "Pending Sync",
        value: filterAppointmentsForQueue(appointments, "receptionist", "awaiting-doctor-assignment").length || (overview?.pending_appointments ?? 0),
        note: "Requires validation",
        icon: AlertCircleIcon,
        color: "text-amber-600",
        bg: "bg-amber-50",
      },
    ],
    [appointments, doctors, overview]
  )

  const upcomingAppointments = useMemo(
    () =>
      appointments.slice(0, 5).map((appointment) => ({
        id: appointment.id,
        time: appointment.startTime || "--:--",
        patient: appointment.patient,
        doctor: appointment.doctor || "TBD",
        type: appointment.illnessCategory,
        status: getAppointmentStatusMeta(appointment.status, appointment.paymentStatus, "admin").label,
        tone: getAppointmentStatusMeta(appointment.status, appointment.paymentStatus, "admin").tone,
      })),
    [appointments]
  )

  return (
    <motion.div
      className="mx-auto w-full max-w-8xl space-y-8 p-4 md:p-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* HERO SECTION */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-md bg-primary p-8 text-white shadow-2xl"
      >
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/10 blur-3xl transition-transform hover:scale-110" />
        
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              System Administration
            </h1>
            <p className="max-w-xl text-lg text-primary-foreground/90">
              Manage hospital operations, monitor real-time patient flow, and oversee medical staff availability from one central command center.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              size="lg"
              variant="outline"
              className="rounded-md border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 transition-all"
              onClick={() => { fetchOverview(); initializeAppointments(); }}
            >
              <HugeiconsIcon icon={RefreshIcon} className={cn("mr-2 h-5 w-5", appointmentsLoading && "animate-spin")} />
              Sync Data
            </Button>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <AppointmentWorkflowLegend />
      </motion.div>

      {/* STATS BENTO GRID */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <motion.div key={stat.title} variants={itemVariants}>
            <Card className="h-full rounded-md border-none shadow-sm transition-all hover:shadow-md hover:translate-y-[-2px]">
              <CardContent className="flex items-center gap-5 p-6">
                <div className={cn("flex h-14 w-14 shrink-0 items-center justify-center rounded-md", stat.bg, stat.color)}>
                  <HugeiconsIcon icon={stat.icon} className="h-7 w-7" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{stat.title}</p>
                  <p className="text-3xl font-black tracking-tight">{stat.value}</p>
                  <p className="mt-1 truncate text-xs text-muted-foreground/60">{stat.note}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* LEFT COLUMN: UPCOMING & QUEUE */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div variants={itemVariants}>
            <Card className="rounded-md border-muted/40 shadow-xl overflow-hidden">
              <CardHeader className="bg-muted/30 border-b pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <HugeiconsIcon icon={Calendar03Icon} className="w-6 h-6 text-primary" />
                      Daily Appointment Flow
                    </CardTitle>
                    <CardDescription>Live overview of today&apos;s schedule</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" className="rounded-md text-primary" onClick={() => router.push("/admin/appointments")}>
                    Manage All <HugeiconsIcon icon={ArrowRight01Icon} className="ml-1 w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-muted/40">
                  {upcomingAppointments.length > 0 ? (
                    upcomingAppointments.map((app) => (
                      <div key={app.id} className="group flex items-center justify-between p-5 transition-colors hover:bg-primary/[0.02]">
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col items-center justify-center rounded-md bg-muted/50 px-3 py-2 text-center min-w-[70px]">
                            <p className="text-[10px] font-black uppercase text-muted-foreground opacity-60">Time</p>
                            <p className="text-sm font-bold text-primary">{app.time}</p>
                          </div>
                          <div>
                            <p className="font-bold text-foreground group-hover:text-primary transition-colors">{app.patient}</p>
                            <p className="text-xs text-muted-foreground">with Dr. {app.doctor} • {app.type}</p>
                          </div>
                        </div>
                        <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest", toneClasses(app.tone))}>
                          {app.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-12 text-center text-muted-foreground">
                      No appointments scheduled for today yet.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* HOSPITAL SNAPSHOT */}
          <motion.div variants={itemVariants} className="grid gap-6 sm:grid-cols-2">
            <Card className="rounded-md border-none bg-indigo-900 text-white shadow-xl relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all" />
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-10 w-10 rounded-md bg-white/10 flex items-center justify-center">
                    <HugeiconsIcon icon={Clock03Icon} className="h-6 w-6" />
                  </div>
                  <p className="font-bold uppercase tracking-widest text-xs text-white/60">Operating Status</p>
                </div>
                <p className="text-4xl font-black mb-1 text-white">24 HRS</p>
                <p className="text-sm text-white/70">Always open, always caring.</p>
                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> System Live
                  </span>
                  <HugeiconsIcon icon={CheckCircle} className="w-4 h-4 text-white/40" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-md border-muted/40 shadow-sm bg-card flex flex-col justify-between">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-tighter">System Users</p>
                  <HugeiconsIcon icon={UserGroupIcon} className="w-5 h-5 text-primary/40" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-2xl font-black">{users.length}</p>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase">Total Patients</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black">{doctors.length}</p>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase">Staff Members</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full rounded-md mt-2" onClick={() => router.push("/users")}>
                  Manage Directory
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: STAFF & ACTIVITY */}
        <div className="space-y-8">
          <motion.div variants={itemVariants}>
            <Card className="rounded-md border-muted/40 shadow-lg overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold">Specialists On Duty</CardTitle>
                  <Button variant="ghost" size="icon" className="rounded-md" onClick={() => router.push("/doctors")}>
                    <HugeiconsIcon icon={MoreHorizontalIcon} className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="space-y-4">
                  {doctors.slice(0, 4).map((doctor) => (
                    <div key={doctor.uuid} className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-11 h-11 rounded-md bg-primary/5 flex items-center justify-center text-primary font-bold group-hover:bg-primary group-hover:text-white transition-all">
                            <HugeiconsIcon icon={Doctor01Icon} className="w-6 h-6" />
                          </div>
                          <div className={cn(
                            "absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-950 shadow-sm",
                            doctor.is_available ? "bg-emerald-500" : "bg-rose-500"
                          )} />
                        </div>
                        <div>
                          <p className="text-sm font-bold group-hover:text-primary transition-colors">{doctor.name}</p>
                          <p className="text-[10px] text-muted-foreground font-medium">{doctor.categories[0] || "Specialist"}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-muted-foreground/60 bg-muted px-2 py-0.5 rounded-md">
                        {doctor.is_available ? "ACTIVE" : "OFFLINE"}
                      </span>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-6 rounded-md text-xs font-bold uppercase tracking-widest h-10 border-dashed" onClick={() => router.push("/admin/doctors")}>
                  Manage Staff Rosters
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="rounded-md border-none bg-slate-900 dark:bg-slate-800 text-white shadow-xl overflow-hidden relative group">
              <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/10 transition-all" />
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <div className="w-8 h-8 rounded-md bg-white/10 flex items-center justify-center">
                    <HugeiconsIcon icon={AlertCircleIcon} className="w-4 h-4 text-amber-400" />
                  </div>
                  Critical Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="space-y-4">
                  {overview?.pending_appointments && overview.pending_appointments > 0 ? (
                    <div className="p-4 rounded-md bg-white/5 border border-white/10 flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0 animate-pulse" />
                      <div>
                        <p className="text-sm font-bold">Unassigned Patients</p>
                        <p className="text-xs text-white/60 mt-1">{overview.pending_appointments} patients require immediate doctor assignment.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-white/5 rounded-md border border-dashed border-white/10">
                      <p className="text-xs font-bold text-white/40 uppercase tracking-widest">No Active Alerts</p>
                    </div>
                  )}
                </div>
                <p className="mt-4 text-[10px] text-center text-white/40 font-medium uppercase tracking-widest">Auto-refreshed every 60s</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
