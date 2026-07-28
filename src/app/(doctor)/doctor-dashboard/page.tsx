"use client"

import { useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock3,
  FlaskConical,
  RefreshCw,
  Users,
} from "lucide-react"
import { toast } from "react-toastify"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DoctorAppointmentCard } from "@/components/customs/doctor-appointment-card"
import { useAuthUserStore } from "@/store/auth/userAuth.store"
import { useAppointmentStore } from "@/store/appointments/appointment.store"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"

function localDateKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export default function DoctorDashboardPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const user = useAuthUserStore((state) => state.user)
  const {
    appointments,
    loading,
    fetchAppointments,
    callNextPatient,
  } = useAppointmentStore()

  useEffect(() => {
    void fetchAppointments()
  }, [fetchAppointments])

  const today = localDateKey()
  const workflow = useMemo(() => {
    const todayAppointments = appointments.filter(
      (appointment) => appointment.date === today
    )
    return {
      confirmed: todayAppointments.filter(
        (appointment) => appointment.status === "confirmed"
      ),
      waiting: todayAppointments.filter((appointment) =>
        ["checked_in", "waiting_in_queue"].includes(appointment.status)
      ),
      consulting: todayAppointments.filter(
        (appointment) => appointment.status === "in_consultation"
      ),
      labReview: appointments.filter((appointment) =>
        ["laboratory_results_ready", "back_to_doctor"].includes(
          appointment.status
        )
      ),
      completed: todayAppointments.filter(
        (appointment) => appointment.status === "completed"
      ),
    }
  }, [appointments, today])

  const activeAppointments = useMemo(
    () =>
      appointments
        .filter(
          (appointment) =>
            appointment.date === today &&
            [
              "confirmed",
              "checked_in",
              "waiting_in_queue",
              "in_consultation",
            ].includes(appointment.status)
        )
        .sort((a, b) =>
          (a.startTime ?? "23:59").localeCompare(b.startTime ?? "23:59")
        ),
    [appointments, today]
  )

  const callNext = async () => {
    try {
      await callNextPatient()
      toast.success(t("doctorHome.callNextSuccess"))
    } catch {
      toast.error(t("doctorHome.callNextError"))
    }
  }

  const stages = [
    {
      label: t("doctorHome.scheduledToday"),
      value: workflow.confirmed.length,
      note: t("doctorHome.waitingToArrive"),
      icon: Clock3,
      tone: "blue",
    },
    {
      label: t("workflowDashboard.waitingInQueue"),
      value: workflow.waiting.length,
      note: t("doctorHome.readyToBeCalled"),
      icon: Users,
      tone: "amber",
    },
    {
      label: t("appointmentStatus.inConsultationLabel"),
      value: workflow.consulting.length,
      note: t("doctorHome.currentlyBeingSeen"),
      icon: Activity,
      tone: "violet",
    },
    {
      label: t("doctorHome.backFromLaboratory"),
      value: workflow.labReview.length,
      note: t("doctorHome.resultsReadyForReview"),
      icon: FlaskConical,
      tone: "emerald",
    },
  ] as const

  return (
    <div className="mx-auto w-full max-w-8xl space-y-6 p-4 md:p-8">
      <section className="relative overflow-hidden rounded-3xl bg-primary p-6 text-primary-foreground shadow-xl md:p-8">
        <div className="absolute -right-24 -top-24 size-72 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-primary-foreground/70">
              {t("doctorHome.eyebrow")}
            </p>
            <h1 className="text-3xl font-black tracking-tight md:text-4xl">
              {t("doctorHome.title", {
                name: user?.last_name || user?.first_name || t("doctorHome.doctorFallback"),
              })}
            </h1>
            <p className="mt-2 text-primary-foreground/80">
              {t("doctorHome.summary", {
                waiting: workflow.waiting.length,
                labs: workflow.labReview.length,
                completed: workflow.completed.length,
              })}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="border-white/25 bg-white/10 text-white hover:bg-white/20 hover:text-white"
              onClick={() => void fetchAppointments()}
              disabled={loading}
            >
              <RefreshCw className={cn("size-4", loading && "animate-spin")} />
              {t("doctorHome.refreshQueue")}
            </Button>
            <Button
              className="bg-white text-primary hover:bg-white/90"
              onClick={() => void callNext()}
              disabled={loading || workflow.waiting.length === 0}
            >
              {t("doctorHome.callNextPatient")}
            </Button>
            <Button
              variant="outline"
              className="border-white/25 bg-white/10 text-white hover:bg-white/20 hover:text-white"
              onClick={() => router.push("/doctor-dashboard/analytics")}
            >
              {t("workflowDashboard.viewAnalytics")} <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stages.map((stage) => {
          const Icon = stage.icon
          return (
            <Card key={stage.label} className="rounded-2xl">
              <CardContent className="flex items-center gap-4 p-5">
                <div
                  className={cn(
                    "flex size-12 items-center justify-center rounded-2xl",
                    stage.tone === "blue" && "bg-blue-500/10 text-blue-700",
                    stage.tone === "amber" && "bg-amber-500/10 text-amber-700",
                    stage.tone === "violet" &&
                      "bg-violet-500/10 text-violet-700",
                    stage.tone === "emerald" &&
                      "bg-emerald-500/10 text-emerald-700"
                  )}
                >
                  <Icon className="size-6" />
                </div>
                <div>
                  <p className="text-3xl font-black">{stage.value}</p>
                  <p className="font-bold">{stage.label}</p>
                  <p className="text-xs text-muted-foreground">{stage.note}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {workflow.labReview.length > 0 && (
        <section className="space-y-4 rounded-3xl border border-emerald-500/30 bg-emerald-500/5 p-5 md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-black">{t("doctorHome.resultsReadyTitle")}</h2>
              <p className="text-sm text-muted-foreground">
                {t("doctorHome.resultsReadyDescription")}
              </p>
            </div>
            <FlaskConical className="size-6 text-emerald-700" />
          </div>
          <div className="grid gap-4">
            {workflow.labReview.map((appointment) => (
              <DoctorAppointmentCard
                key={appointment.id}
                appointment={appointment}
              />
            ))}
          </div>
        </section>
      )}

      <Card className="overflow-hidden rounded-3xl">
        <CardHeader className="flex flex-col items-start justify-between gap-3 border-b min-[420px]:flex-row min-[420px]:items-center">
          <div>
            <CardTitle>{t("doctorHome.todayQueue")}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("doctorHome.todayQueueDescription")}
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={() =>
              router.push("/doctor-dashboard/appointments/pending")
            }
          >
            {t("doctorHome.viewAll")} <ArrowRight className="size-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-5 md:p-6">
          {loading && appointments.length === 0 ? (
            <div className="h-64 animate-pulse rounded-2xl bg-muted/40" />
          ) : activeAppointments.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center text-center">
              <CheckCircle2 className="mb-3 size-12 text-emerald-600" />
              <p className="text-lg font-bold">{t("doctorHome.queueClear")}</p>
              <p className="text-sm text-muted-foreground">
                {t("doctorHome.queueClearDescription")}
              </p>
            </div>
          ) : (
            <div className="grid gap-5">
              {activeAppointments.map((appointment) => (
                <DoctorAppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
