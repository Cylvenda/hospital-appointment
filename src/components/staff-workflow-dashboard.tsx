"use client"

import { useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  Activity,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  CreditCard,
  RefreshCw,
  Stethoscope,
  Users,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAdminStore } from "@/store/admin/admin.store"
import { useAppointmentStore } from "@/store/appointments/appointment.store"
import { useAuthUserStore } from "@/store/auth/userAuth.store"
import { getAppointmentStatusMeta } from "@/lib/appointment-workflow"
import { useTranslation } from "@/lib/i18n"
import { cn } from "@/lib/utils"

type StaffRole = "admin" | "receptionist"

function localDateKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function StaffWorkflowDashboard({ role }: { role: StaffRole }) {
  const { t } = useTranslation()
  const router = useRouter()
  const user = useAuthUserStore((state) => state.user)
  const {
    appointments,
    loading,
    initialize,
  } = useAppointmentStore()
  const {
    doctors,
    overview,
    fetchDoctors,
    fetchOverview,
  } = useAdminStore()

  const refresh = async () => {
    await Promise.all([initialize(), fetchDoctors(), fetchOverview()])
  }

  useEffect(() => {
    void refresh()
    // These Zustand actions are stable references.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const today = localDateKey()
  const workflow = useMemo(() => {
    const awaitingPayment = appointments.filter(
      (appointment) =>
        appointment.status === "pending" &&
        appointment.paymentStatus !== "completed"
    )
    const todayAppointments = appointments.filter(
      (appointment) => appointment.date === today
    )
    const arrivals = todayAppointments.filter(
      (appointment) => appointment.status === "confirmed"
    )
    const queue = todayAppointments.filter((appointment) =>
      ["checked_in", "waiting_in_queue"].includes(appointment.status)
    )
    const inCare = todayAppointments.filter((appointment) =>
      [
        "in_consultation",
        "waiting_for_laboratory",
        "laboratory_in_progress",
        "laboratory_results_ready",
        "back_to_doctor",
      ].includes(appointment.status)
    )
    const completed = todayAppointments.filter(
      (appointment) => appointment.status === "completed"
    )
    return {
      awaitingPayment,
      todayAppointments,
      arrivals,
      queue,
      inCare,
      completed,
    }
  }, [appointments, today])

  const base =
    role === "admin"
      ? "/appointments"
      : "/receptionist-dashboard/appointments"
  const todayPath =
    role === "admin" ? `${base}/accepted` : `${base}/assignments`
  const analyticsPath =
    role === "admin" ? "/analytics" : "/receptionist-dashboard/analytics"

  const stageCards = [
    {
      label: t("workflowDashboard.awaitingPayment"),
      value: workflow.awaitingPayment.length,
      note: t("workflowDashboard.awaitingPaymentNote"),
      icon: CreditCard,
      href: `${base}/pending`,
      tone: "amber",
    },
    {
      label: t("workflowDashboard.expectedArrivals"),
      value: workflow.arrivals.length,
      note: t("workflowDashboard.expectedArrivalsNote"),
      icon: CalendarClock,
      href: todayPath,
      tone: "blue",
    },
    {
      label: t("workflowDashboard.waitingInQueue"),
      value: workflow.queue.length,
      note: t("workflowDashboard.waitingInQueueNote"),
      icon: Users,
      href: todayPath,
      tone: "violet",
    },
    {
      label: t("workflowDashboard.inActiveCare"),
      value: workflow.inCare.length,
      note: t("workflowDashboard.inActiveCareNote"),
      icon: Activity,
      href: todayPath,
      tone: "emerald",
    },
  ] as const

  const sortedToday = [...workflow.todayAppointments].sort((a, b) =>
    (a.startTime ?? "23:59").localeCompare(b.startTime ?? "23:59")
  )

  return (
    <div className="mx-auto w-full max-w-8xl space-y-6 p-4 md:p-8">
      <section className="overflow-hidden rounded-3xl bg-primary text-primary-foreground shadow-xl">
        <div className="relative p-6 md:p-8">
          <div className="absolute -right-20 -top-24 size-72 rounded-full bg-white/10 blur-3xl" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-primary-foreground/70">
                {role === "admin"
                  ? t("workflowDashboard.adminEyebrow")
                  : t("workflowDashboard.receptionEyebrow")}
              </p>
              <h1 className="text-3xl font-black tracking-tight md:text-4xl">
                {role === "admin"
                  ? t("workflowDashboard.adminTitle")
                  : t("workflowDashboard.welcomeReceptionist", {
                      name: user?.first_name || t("workflowDashboard.receptionistFallback"),
                    })}
              </h1>
              <p className="mt-2 max-w-2xl text-primary-foreground/80">
                {t("workflowDashboard.heroSummary", {
                  arrivals: workflow.arrivals.length + workflow.queue.length,
                  payments: workflow.awaitingPayment.length,
                })}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                className="border-white/25 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                onClick={() => void refresh()}
                disabled={loading}
              >
                <RefreshCw className={cn("size-4", loading && "animate-spin")} />
                {t("workflowDashboard.refresh")}
              </Button>
              <Button
                className="bg-white text-primary hover:bg-white/90"
                onClick={() => router.push(analyticsPath)}
              >
                {t("workflowDashboard.viewAnalytics")}
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stageCards.map((stage) => {
          const Icon = stage.icon
          return (
            <button
              key={stage.label}
              type="button"
              onClick={() => router.push(stage.href)}
              className="rounded-2xl border bg-card p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div
                  className={cn(
                    "flex size-12 items-center justify-center rounded-2xl",
                    stage.tone === "amber" && "bg-amber-500/10 text-amber-700",
                    stage.tone === "blue" && "bg-blue-500/10 text-blue-700",
                    stage.tone === "violet" &&
                      "bg-violet-500/10 text-violet-700",
                    stage.tone === "emerald" &&
                      "bg-emerald-500/10 text-emerald-700"
                  )}
                >
                  <Icon className="size-6" />
                </div>
                <span className="text-4xl font-black tabular-nums">
                  {stage.value}
                </span>
              </div>
              <p className="mt-4 font-bold">{stage.label}</p>
              <p className="text-xs text-muted-foreground">{stage.note}</p>
            </button>
          )
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Card className="overflow-hidden rounded-3xl">
          <CardHeader className="flex flex-row items-center justify-between border-b">
            <div>
              <CardTitle>Today’s patient movement</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("workflowDashboard.movementSummary")}
              </p>
            </div>
            <Button variant="ghost" onClick={() => router.push(todayPath)}>
              {t("workflowDashboard.openQueue")} <ArrowRight className="size-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {sortedToday.length === 0 ? (
              <div className="flex min-h-64 flex-col items-center justify-center p-8 text-center">
                <CheckCircle2 className="mb-3 size-10 text-emerald-600" />
                <p className="font-semibold">{t("workflowDashboard.noAppointmentsToday")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("workflowDashboard.noAppointmentsTodayHelp")}
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {sortedToday.slice(0, 8).map((appointment) => {
                  const status = getAppointmentStatusMeta(
                    appointment.status,
                    appointment.paymentStatus,
                    role
                  )
                  return (
                    <button
                      key={appointment.id}
                      type="button"
                      onClick={() =>
                        router.push(`${base}/${appointment.id}`)
                      }
                      className="grid w-full gap-3 p-4 text-left transition hover:bg-muted/30 sm:grid-cols-[5rem_1fr_auto] sm:items-center"
                    >
                      <div className="rounded-xl bg-muted px-3 py-2 text-center font-black text-primary">
                        {appointment.startTime?.slice(0, 5) || "--:--"}
                      </div>
                      <div>
                        <p className="font-bold">{appointment.patient}</p>
                        <p className="text-xs text-muted-foreground">
                          {appointment.doctor || t("workflowDashboard.doctorUnavailable")} ·{" "}
                          {appointment.illnessCategory}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {appointment.queueNumber && (
                          <Badge>{t("workflowDashboard.queueNumber", { number: appointment.queueNumber })}</Badge>
                        )}
                        <Badge variant="outline">{status.label}</Badge>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle>{t("workflowDashboard.todayAtGlance")}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-blue-500/10 p-4">
                <p className="text-3xl font-black text-blue-700">
                  {workflow.todayAppointments.length}
                </p>
                <p className="text-xs font-semibold text-blue-700/70">
                  {t("workflowDashboard.totalScheduled")}
                </p>
              </div>
              <div className="rounded-2xl bg-emerald-500/10 p-4">
                <p className="text-3xl font-black text-emerald-700">
                  {workflow.completed.length}
                </p>
                <p className="text-xs font-semibold text-emerald-700/70">
                  {t("workflowDashboard.completed")}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="size-5 text-primary" />
                {t("workflowDashboard.serviceReadiness")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-xl border p-3">
                <span className="text-sm text-muted-foreground">
                  {t("workflowDashboard.availableDoctors")}
                </span>
                <span className="font-black">
                  {doctors.filter((doctor) => doctor.is_available).length}
                </span>
              </div>
              {role === "admin" && (
                <>
                  <div className="flex items-center justify-between rounded-xl border p-3">
                    <span className="text-sm text-muted-foreground">
                      {t("workflowDashboard.registeredPatients")}
                    </span>
                    <span className="font-black">
                      {overview?.total_patients ?? 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border p-3">
                    <span className="text-sm text-muted-foreground">
                      {t("workflowDashboard.laboratoryStaff")}
                    </span>
                    <span className="font-black">
                      {overview?.total_lab_techs ?? 0}
                    </span>
                  </div>
                </>
              )}
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  router.push(
                    role === "admin"
                      ? "/doctors"
                      : "/receptionist-dashboard/doctors"
                  )
                }
              >
                {t("workflowDashboard.manageDoctorSchedules")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
