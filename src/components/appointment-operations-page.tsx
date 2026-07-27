"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Activity,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  RefreshCw,
  Search,
  Users,
  XCircle,
} from "lucide-react"
import AssignAppointment from "@/components/customs/assign-appointment"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAppointmentStore } from "@/store/appointments/appointment.store"
import type {
  Appointment,
  AppointmentStatus,
} from "@/store/appointments/appointment.types"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"

export type OperationsRole = "admin" | "receptionist"
export type OperationsView =
  | "all"
  | "awaiting-payment"
  | "today"
  | "completed"
  | "cancelled"

type Props = {
  role: OperationsRole
  view: OperationsView
}

const ACTIVE_CARE_STATUSES: AppointmentStatus[] = [
  "checked_in",
  "waiting_in_queue",
  "in_consultation",
  "waiting_for_laboratory",
  "laboratory_in_progress",
  "laboratory_results_ready",
  "back_to_doctor",
]

const CLOSED_STATUSES: AppointmentStatus[] = [
  "completed",
  "cancelled",
  "no_show",
  "rescheduled",
]

const VIEW_COPY: Record<
  OperationsView,
  { title: string; summary: string; empty: string }
> = {
  all: {
    title: "Appointment Operations",
    summary:
      "Follow every visit from payment confirmation through arrival, consultation, laboratory, and completion.",
    empty: "No appointments match this search.",
  },
  "awaiting-payment": {
    title: "Awaiting Payment",
    summary:
      "These selected slots are temporarily reserved until patient payment is confirmed.",
    empty: "No appointments are waiting for payment.",
  },
  today: {
    title: "Today’s Arrivals & Queue",
    summary:
      "Coordinate confirmed arrivals, check patients in, and monitor their live care progress.",
    empty: "No patients are scheduled or moving through care today.",
  },
  completed: {
    title: "Completed Visits",
    summary:
      "Review consultations that doctors have completed and closed.",
    empty: "No completed visits are available.",
  },
  cancelled: {
    title: "Cancelled & Missed",
    summary:
      "Review cancelled, rescheduled, and no-show appointments whose slots were released.",
    empty: "No cancelled or missed appointments are available.",
  },
}

function localDateKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function isAwaitingPayment(appointment: Appointment) {
  return (
    appointment.status === "pending" &&
    appointment.paymentStatus !== "success"
  )
}

function isTodayActive(appointment: Appointment) {
  return (
    appointment.date === localDateKey() &&
    !CLOSED_STATUSES.includes(appointment.status)
  )
}

function filterForView(
  appointment: Appointment,
  view: OperationsView
): boolean {
  if (view === "all") return true
  if (view === "awaiting-payment") return isAwaitingPayment(appointment)
  if (view === "today") return isTodayActive(appointment)
  if (view === "completed") return appointment.status === "completed"
  return ["cancelled", "no_show", "rescheduled"].includes(appointment.status)
}

function compareAppointments(a: Appointment, b: Appointment) {
  const aKey = `${a.date || "9999-12-31"} ${a.startTime || "23:59"}`
  const bKey = `${b.date || "9999-12-31"} ${b.startTime || "23:59"}`
  return aKey.localeCompare(bKey)
}

export function AppointmentOperationsPage({ role, view }: Props) {
  const { t } = useTranslation()
  const router = useRouter()
  const [search, setSearch] = useState("")
  const {
    appointments,
    doctors,
    loading,
    error,
    initialized,
    initialize,
    cancelAppointment,
  } = useAppointmentStore()

  useEffect(() => {
    if (!initialized) {
      void initialize()
    }
  }, [initialize, initialized])

  const base =
    role === "admin"
      ? "/appointments"
      : "/receptionist-dashboard/appointments"

  const stageCounts = useMemo(
    () => ({
      payment: appointments.filter(isAwaitingPayment).length,
      arrivals: appointments.filter(
        (appointment) =>
          appointment.date === localDateKey() &&
          appointment.status === "confirmed"
      ).length,
      active: appointments.filter((appointment) =>
        ACTIVE_CARE_STATUSES.includes(appointment.status)
      ).length,
      completed: appointments.filter(
        (appointment) => appointment.status === "completed"
      ).length,
    }),
    [appointments]
  )

  const visibleAppointments = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()
    return appointments
      .filter((appointment) => filterForView(appointment, view))
      .filter((appointment) => {
        if (!normalizedSearch) return true
        return [
          appointment.patient,
          appointment.email,
          appointment.appointmentId,
          appointment.doctor,
          appointment.illnessCategory,
          appointment.queueNumber?.toString(),
        ].some((value) => value?.toLowerCase().includes(normalizedSearch))
      })
      .sort(compareAppointments)
  }, [appointments, search, view])

  const stages = [
    {
      label: t("workflowOperations.stagePaymentLabel"),
      description: t("workflowOperations.stagePaymentDescription"),
      count: stageCounts.payment,
      icon: CreditCard,
      href: `${base}/pending`,
      active: view === "awaiting-payment",
      tone: "amber",
    },
    {
      label: t("workflowOperations.stageArrivalLabel"),
      description: t("workflowOperations.stageArrivalDescription"),
      count: stageCounts.arrivals,
      icon: CalendarDays,
      href: `${base}/${role === "admin" ? "accepted" : "assignments"}`,
      active: view === "today",
      tone: "blue",
    },
    {
      label: t("workflowOperations.stageInCareLabel"),
      description: t("workflowOperations.stageInCareDescription"),
      count: stageCounts.active,
      icon: Activity,
      href: `${base}/${role === "admin" ? "accepted" : "assignments"}`,
      active: view === "today",
      tone: "violet",
    },
    {
      label: t("workflowOperations.stageCompletedLabel"),
      description: t("workflowOperations.stageCompletedDescription"),
      count: stageCounts.completed,
      icon: CheckCircle2,
      href: `${base}/completed`,
      active: view === "completed",
      tone: "emerald",
    },
  ] as const

  if (loading && appointments.length === 0) {
    return (
      <div className="flex min-h-96 items-center justify-center rounded-3xl border bg-card">
        <div className="flex flex-col items-center gap-3 text-center">
          <RefreshCw className="size-7 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">
            {t("workflowOperations.loading")}
          </p>
        </div>
      </div>
    )
  }

  if (error && appointments.length === 0) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center gap-4 rounded-3xl border border-rose-200 bg-rose-50/50 p-8 text-center">
        <XCircle className="size-10 text-rose-600" />
        <div>
          <p className="font-semibold text-rose-900">{t("workflowOperations.errorTitle")}</p>
          <p className="mt-1 text-sm text-rose-700">{error}</p>
        </div>
        <Button variant="outline" onClick={() => void initialize()}>
          {t("workflowOperations.tryAgain")}
        </Button>
      </div>
    )
  }

  const copy = VIEW_COPY[view]

  return (
    <div className="w-full max-w-8xl space-y-6">
      <section className="overflow-hidden rounded-3xl border bg-card shadow-sm">
        <div className="bg-gradient-to-br from-primary/10 via-background to-blue-500/10 p-6 md:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                <Users className="size-4" />
                {role === "admin"
                  ? t("workflowOperations.adminEyebrow")
                  : t("workflowOperations.receptionEyebrow")}
              </div>
              <h1 className="text-3xl font-black tracking-tight md:text-4xl">
                {copy.title}
              </h1>
              <p className="mt-2 text-sm leading-6 text-muted-foreground md:text-base">
                {copy.summary}
              </p>
            </div>
              <Button
              variant="outline"
              className="rounded-xl bg-background/80"
              onClick={() => void initialize()}
              disabled={loading}
            >
              <RefreshCw className={cn("size-4", loading && "animate-spin")} />
              {t("workflowOperations.refresh")}
            </Button>
          </div>
        </div>

        <div className="grid border-t sm:grid-cols-2 xl:grid-cols-4">
          {stages.map((stage) => {
            const Icon = stage.icon
            return (
              <button
                key={stage.label}
                type="button"
                onClick={() => router.push(stage.href)}
                className={cn(
                  "group flex items-center gap-4 border-b p-4 text-left transition-colors hover:bg-muted/40 sm:border-r xl:border-b-0",
                  stage.active && "bg-primary/5"
                )}
              >
                <div
                  className={cn(
                    "flex size-11 shrink-0 items-center justify-center rounded-2xl",
                    stage.tone === "amber" && "bg-amber-500/10 text-amber-700",
                    stage.tone === "blue" && "bg-blue-500/10 text-blue-700",
                    stage.tone === "violet" && "bg-violet-500/10 text-violet-700",
                    stage.tone === "emerald" &&
                      "bg-emerald-500/10 text-emerald-700"
                  )}
                >
                  <Icon className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold">{stage.label}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {stage.description}
                  </p>
                </div>
                <span className="text-2xl font-black tabular-nums">
                  {stage.count}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold">
              {view === "all" ? t("workflowOperations.registerTitle") : copy.title}
            </h2>
            <p className="text-sm text-muted-foreground">
              {visibleAppointments.length}{" "}
              {visibleAppointments.length === 1
                ? t("workflowOperations.singleAppointment")
                : t("workflowOperations.multipleAppointments")}
            </p>
          </div>
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("workflowOperations.searchPlaceholder")}
              className="h-11 rounded-xl pl-9"
            />
          </div>
        </div>

        {visibleAppointments.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-3xl border border-dashed bg-muted/10 p-8 text-center">
            <CheckCircle2 className="mb-3 size-10 text-emerald-600" />
            <p className="font-semibold">{copy.empty}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("workflowOperations.emptyHelp")}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {visibleAppointments.map((appointment) => (
              <AssignAppointment
                key={appointment.id}
                appointment={appointment}
                doctors={doctors}
                onCancel={cancelAppointment}
                audience={role}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
