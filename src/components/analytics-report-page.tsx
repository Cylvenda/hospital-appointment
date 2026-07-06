"use client"

import { useEffect, useMemo, useState } from "react"
import { toast } from "react-toastify"
import {
  Activity,
  Ban,
  CalendarCheck,
  CheckCircle2,
  Download,
  FileText,
  RefreshCw,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppointmentStore } from "@/store/appointments/appointment.store"
import { useAuthUserStore } from "@/store/auth/userAuth.store"
import type { AppointmentStatus } from "@/store/appointments/appointment.types"
import { getAppointmentStatusMeta } from "@/lib/appointment-workflow"
import { useTranslation } from "@/lib/i18n"
import { cn } from "@/lib/utils"

type AnalyticsRole = "admin" | "receptionist" | "doctor"

const STATUS_ORDER: AppointmentStatus[] = [
  "pending",
  "confirmed",
  "waiting_in_queue",
  "in_consultation",
  "waiting_for_laboratory",
  "laboratory_in_progress",
  "back_to_doctor",
  "completed",
  "cancelled",
  "no_show",
  "rescheduled",
]

const ROLE_COPY: Record<
  AnalyticsRole,
  { eyebrow: string; title: string; description: string }
> = {
  admin: {
    eyebrow: "Hospital performance",
    title: "Analytics & Reports",
    description:
      "Review appointment outcomes across the hospital and export the full administrative report.",
  },
  receptionist: {
    eyebrow: "Front desk performance",
    title: "Analytics & Reports",
    description:
      "Review payment, arrival, queue, and visit outcomes handled by the front desk.",
  },
  doctor: {
    eyebrow: "Clinical performance",
    title: "My Analytics & Reports",
    description:
      "Review your assigned consultations and export your personal clinical activity report.",
  },
}

function localDateKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function AnalyticsReportPage({ role }: { role: AnalyticsRole }) {
  const { t } = useTranslation()
  const {
    appointments,
    loading,
    initialized,
    initialize,
  } = useAppointmentStore()
  const exportMyReport = useAuthUserStore((state) => state.exportMyReport)
  const reportLoading = useAuthUserStore((state) => state.loading)
  const [exporting, setExporting] = useState<"pdf" | "docx" | null>(null)

  useEffect(() => {
    if (!initialized) {
      void initialize()
    }
  }, [initialize, initialized])

  const metrics = useMemo(() => {
    const total = appointments.length
    const completed = appointments.filter(
      (appointment) => appointment.status === "completed"
    ).length
    const cancelled = appointments.filter((appointment) =>
      ["cancelled", "no_show", "rescheduled"].includes(appointment.status)
    ).length
    const today = appointments.filter(
      (appointment) => appointment.date === localDateKey()
    ).length
    const completionRate = total ? Math.round((completed / total) * 100) : 0
    return { total, completed, cancelled, today, completionRate }
  }, [appointments])

  const statusRows = useMemo(
    () =>
      STATUS_ORDER.map((status) => ({
        status,
        count: appointments.filter(
          (appointment) => appointment.status === status
        ).length,
        meta: getAppointmentStatusMeta(status, null, role),
      })).filter((row) => row.count > 0),
    [appointments, role]
  )

  const exportReport = async (format: "pdf" | "docx") => {
    setExporting(format)
    try {
      await exportMyReport(format)
      toast.success(
        t("analytics.reportDownloaded", { format: format.toUpperCase() })
      )
    } catch {
      toast.error(t("analytics.reportDownloadFailed"))
    } finally {
      setExporting(null)
    }
  }

  const copy = ROLE_COPY[role]
  const cards = [
    {
      label:
        role === "doctor"
          ? t("analytics.myAppointments")
          : t("analytics.totalAppointments"),
      value: metrics.total,
      note: t("analytics.allAvailableRecords"),
      icon: Users,
      tone: "blue",
    },
    {
      label: t("analytics.scheduledToday"),
      value: metrics.today,
      note: t("analytics.todayWorkload"),
      icon: CalendarCheck,
      tone: "violet",
    },
    {
      label: t("analytics.completedVisits"),
      value: metrics.completed,
      note: t("analytics.completionRate", { rate: metrics.completionRate }),
      icon: CheckCircle2,
      tone: "emerald",
    },
    {
      label: t("analytics.cancelledOrMissed"),
      value: metrics.cancelled,
      note: t("analytics.includesRescheduled"),
      icon: Ban,
      tone: "rose",
    },
  ] as const

  return (
    <div className="mx-auto w-full max-w-8xl space-y-6 p-4 md:p-8">
      <section className="overflow-hidden rounded-3xl border bg-card shadow-sm">
        <div className="bg-gradient-to-br from-primary/10 via-background to-blue-500/10 p-6 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-primary">
                {copy.eyebrow}
              </p>
              <h1 className="text-3xl font-black tracking-tight md:text-4xl">
                {copy.title}
              </h1>
              <p className="mt-2 text-muted-foreground">{copy.description}</p>
            </div>
            <Button
              variant="outline"
              className="rounded-xl bg-background/80"
              onClick={() => void initialize()}
              disabled={loading}
            >
              <RefreshCw className={cn("size-4", loading && "animate-spin")} />
              {t("analytics.refreshAnalytics")}
            </Button>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.label} className="rounded-2xl">
              <CardContent className="flex items-center gap-4 p-5">
                <div
                  className={cn(
                    "flex size-12 items-center justify-center rounded-2xl",
                    card.tone === "blue" && "bg-blue-500/10 text-blue-700",
                    card.tone === "violet" && "bg-violet-500/10 text-violet-700",
                    card.tone === "emerald" &&
                      "bg-emerald-500/10 text-emerald-700",
                    card.tone === "rose" && "bg-rose-500/10 text-rose-700"
                  )}
                >
                  <Icon className="size-6" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {card.label}
                  </p>
                  <p className="text-3xl font-black">{card.value}</p>
                  <p className="text-xs text-muted-foreground">{card.note}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="size-5 text-primary" />
              {t("analytics.statusDistribution")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {statusRows.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">
                {t("analytics.noData")}
              </p>
            ) : (
              statusRows.map((row) => {
                const percentage = metrics.total
                  ? Math.round((row.count / metrics.total) * 100)
                  : 0
                return (
                  <div key={row.status} className="space-y-2">
                    <div className="flex items-center justify-between gap-4 text-sm">
                      <span className="font-semibold">{row.meta.label}</span>
                      <span className="text-muted-foreground">
                        {row.count} · {percentage}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden rounded-3xl border-primary/20">
          <CardHeader className="bg-primary text-primary-foreground">
            <CardTitle className="flex items-center gap-2">
              <FileText className="size-5" />
              {t("analytics.downloadReport")}
            </CardTitle>
            <p className="text-sm text-primary-foreground/75">
              {t("analytics.reportContainsRoleData")}
            </p>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div className="rounded-2xl border bg-muted/20 p-4 text-sm text-muted-foreground">
              {t("analytics.downloadHelp")}
            </div>
            <Button
              className="h-12 w-full rounded-xl"
              onClick={() => void exportReport("pdf")}
              disabled={reportLoading || exporting !== null}
            >
              <Download className="size-4" />
              {exporting === "pdf"
                ? t("analytics.preparingPdf")
                : t("analytics.downloadPdf")}
            </Button>
            <Button
              variant="outline"
              className="h-12 w-full rounded-xl"
              onClick={() => void exportReport("docx")}
              disabled={reportLoading || exporting !== null}
            >
              <Download className="size-4" />
              {exporting === "docx"
                ? t("analytics.preparingDocx")
                : t("analytics.downloadDocx")}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
