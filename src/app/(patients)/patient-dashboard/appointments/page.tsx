"use client"

import { useEffect, useMemo, useState } from "react"
import { toast } from "react-toastify"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircleIcon, Calendar03Icon, MedicineBottle01Icon, CheckmarkCircle02Icon, Cancel01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useAppointmentStore } from "@/store/appointments/appointment.store"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { useAuthUserStore } from "@/store/auth/userAuth.store"
import { appointmentService } from "@/api/services/appointment.service"
import type {
  AvailableAppointmentDay,
  AvailableAppointmentSlot,
  DoctorApi,
} from "@/store/appointments/appointment.types"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"

export default function PatientAppointmentsPage() {
  const { t, language } = useTranslation()
  const router = useRouter()
  const { checkAuth } = useAuthUserStore()
  const {
    illnessCategories,
    fetchAppointments,
    fetchIllnessCategories,
    createAppointment,
  } = useAppointmentStore()

  const [illnessCategoryId, setIllnessCategoryId] = useState("")
  const [doctors, setDoctors] = useState<DoctorApi[]>([])
  const [doctorId, setDoctorId] = useState("")
  const [availableDays, setAvailableDays] = useState<AvailableAppointmentDay[]>([])
  const [appointmentDate, setAppointmentDate] = useState("")
  const [availableSlots, setAvailableSlots] = useState<AvailableAppointmentSlot[]>([])
  const [startTime, setStartTime] = useState("")
  const [loadingAvailability, setLoadingAvailability] = useState(false)
  const [description, setDescription] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [summaryOpen, setSummaryOpen] = useState(false)
  const [readyToPay, setReadyToPay] = useState(false)

  useEffect(() => {
    void (async () => {
      const authenticated = await checkAuth()
      if (!authenticated) {
        router.replace("/login")
        return
      }

      const currentUser = useAuthUserStore.getState().user
      if (currentUser?.role !== "patient") {
        router.replace("/")
        return
      }

      if (!currentUser.patient_profile?.is_profile_complete) {
        toast.warning(t("booking.profileIncompleteToast"))
        router.replace("/patient-dashboard/profile")
        return
      }

      void fetchAppointments()
      void fetchIllnessCategories()
    })()
  }, [checkAuth, fetchAppointments, fetchIllnessCategories, router, t])

  useEffect(() => {
    setDoctorId("")
    setDoctors([])
    setAvailableDays([])
    setAppointmentDate("")
    setAvailableSlots([])
    setStartTime("")
    if (!illnessCategoryId) return

    void (async () => {
      setLoadingAvailability(true)
      try {
        const response = await appointmentService.listDoctors(illnessCategoryId)
        setDoctors(response.data)
      } catch {
        toast.error(t("booking.loadDoctorsError"))
      } finally {
        setLoadingAvailability(false)
      }
    })()
  }, [illnessCategoryId, t])

  useEffect(() => {
    setAvailableDays([])
    setAppointmentDate("")
    setAvailableSlots([])
    setStartTime("")
    if (!doctorId) return

    void (async () => {
      setLoadingAvailability(true)
      try {
        const response = await appointmentService.listAvailableDays(doctorId)
        setAvailableDays(response.data)
      } catch {
        toast.error(t("booking.loadDaysError"))
      } finally {
        setLoadingAvailability(false)
      }
    })()
  }, [doctorId, t])

  useEffect(() => {
    setAvailableSlots([])
    setStartTime("")
    if (!doctorId || !appointmentDate) return

    void (async () => {
      setLoadingAvailability(true)
      try {
        const response = await appointmentService.listAvailableSlots(
          doctorId,
          appointmentDate
        )
        setAvailableSlots(response.data)
      } catch {
        toast.error(t("booking.loadSlotsError"))
      } finally {
        setLoadingAvailability(false)
      }
    })()
  }, [appointmentDate, doctorId, t])

  const selectedDoctor = useMemo(
    () => doctors.find((doctor) => doctor.uuid === doctorId),
    [doctorId, doctors]
  )
  const selectedCategory = useMemo(
    () => illnessCategories.find((category) => category.id === illnessCategoryId),
    [illnessCategories, illnessCategoryId]
  )
  const selectedSlot = useMemo(
    () => availableSlots.find((slot) => slot.start_time === startTime),
    [availableSlots, startTime]
  )

  const isValid = 
    !!illnessCategoryId && 
    !!doctorId &&
    !!appointmentDate &&
    !!startTime &&
    !!description.trim()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid || submitting) return
    setReadyToPay(false)
    setSummaryOpen(true)
  }

  const confirmAppointment = async () => {
    if (!isValid || submitting || !readyToPay) return
    setSubmitting(true)
    try {
      const appointment = await createAppointment({
        illnessCategoryId,
        doctorId,
        appointmentDate,
        startTime,
        description: description.trim(),
      })

      toast.success(t("booking.createSuccess"))

      // Reset form fields
      setIllnessCategoryId("")
      setDoctorId("")
      setAppointmentDate("")
      setStartTime("")
      setDescription("")
      setSummaryOpen(false)
      setReadyToPay(false)
      
      router.push(`/patient-dashboard/appointments/${appointment.id}`)
    } catch {
      toast.error(t("booking.createError"))
    } finally {
      setSubmitting(false)
    }
  }

  const handleReset = () => {
    setIllnessCategoryId("")
    setDoctorId("")
    setAppointmentDate("")
    setStartTime("")
    setDescription("")
    setSummaryOpen(false)
    setReadyToPay(false)
    toast.info(t("booking.cleared"))
  }

  return (
    <div className="w-full max-w-8xl mx-auto space-y-5 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">{t("booking.title")}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {t("booking.subtitle")}
          </p>
        </div>
        <Button 
          variant="outline"
          type="button"
          onClick={() => router.push("/patient-dashboard")}
          className="rounded-xl h-11 px-5 font-bold transition-all border-border hover:bg-muted/40"
        >
          {t("booking.backToDashboard")}
        </Button>
      </div>

      {/* ANNOUNCEMENT BANNER */}
      <div className="flex items-center gap-4 p-3 bg-sky-500/10 dark:bg-sky-950/20 border border-sky-500/20 rounded-2xl text-sky-800 dark:text-sky-300 shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
          <HugeiconsIcon icon={AlertCircleIcon} className="w-6 h-6" />
        </div>
        <p className="text-sm leading-relaxed">
          <span className="font-bold">{t("booking.noteLabel")}:</span> {t("booking.noteBody")}
        </p>
      </div>

      {/* SINGLE FORM CONTAINER */}
      <Card className="rounded-md border border-border bg-card shadow-xl shadow-foreground/[0.02] overflow-hidden">
        <CardHeader className="p-8 pb-6 border-b border-border/80 bg-muted/20">
          <CardTitle className="text-xl font-bold flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <HugeiconsIcon icon={Calendar03Icon} className="w-5 h-5" />
            </span>
            {t("booking.cardTitle")}
          </CardTitle>
          <CardDescription>
            {t("booking.cardDescription")}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-5">
          <div className="mb-8 grid gap-3 sm:grid-cols-3 xl:grid-cols-6">
            {[
              { label: t("booking.stepDepartment"), complete: Boolean(illnessCategoryId) },
              { label: t("booking.stepDoctor"), complete: Boolean(doctorId) },
              { label: t("booking.stepWorkingDay"), complete: Boolean(appointmentDate) },
              { label: t("booking.stepFreeSlot"), complete: Boolean(startTime) },
              { label: t("booking.stepSymptoms"), complete: Boolean(description.trim()) },
              {
                label: t("booking.stepReviewPayment"),
                complete: summaryOpen && readyToPay,
              },
            ].map((step, index) => (
              <div
                key={step.label}
                className={cn(
                  "rounded-xl border p-3 transition-colors",
                  step.complete
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700"
                    : "border-border bg-muted/20 text-muted-foreground"
                )}
              >
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">
                  {t("booking.stepLabel", { step: index + 1 })}
                </p>
                <p className="mt-1 text-sm font-bold">{step.label}</p>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* SECTION 1: CLINICAL CATEGORY */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
                <h3 className="text-sm font-extrabold uppercase tracking-widest text-muted-foreground opacity-90">
                  {t("booking.sectionClinicalClassification")}
                </h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {illnessCategories.map((category) => {
                  const selected = illnessCategoryId === category.id
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setIllnessCategoryId(category.id)}
                      className={cn(
                        "group rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md",
                        selected
                          ? "border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/20"
                          : "border-border bg-background hover:border-emerald-500/40"
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-bold">{category.name}</p>
                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                            {category.description || t("booking.defaultCategoryDescription")}
                          </p>
                        </div>
                        <span
                          className={cn(
                            "flex size-6 shrink-0 items-center justify-center rounded-full border text-xs",
                            selected
                              ? "border-emerald-500 bg-emerald-500 text-white"
                              : "border-border"
                          )}
                        >
                          {selected ? "✓" : ""}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {illnessCategoryId && <hr className="border-border/80" />}

            {/* SECTION 2: DOCTOR RESULTS */}
            {illnessCategoryId && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
                <h3 className="text-sm font-extrabold uppercase tracking-widest text-muted-foreground opacity-90">
                  {t("booking.sectionSelectDoctor")}
                </h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
                {t("booking.availableDoctorsFor", {
                  category: selectedCategory?.name || "",
                })}
              </p>
              {loadingAvailability && doctors.length === 0 ? (
                <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                  {t("booking.loadingDoctors")}
                </div>
              ) : doctors.length === 0 ? (
                <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                  {t("booking.noDoctors")}
                </div>
              ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {doctors.map((doctor) => {
                  const selected = doctorId === doctor.uuid
                  return (
                    <button
                      key={doctor.uuid}
                      type="button"
                      onClick={() => setDoctorId(doctor.uuid)}
                      className={cn(
                        "rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md",
                        selected
                          ? "border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/20"
                          : "border-border bg-background hover:border-blue-500/40"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex size-11 items-center justify-center rounded-2xl bg-blue-500/10 font-black text-blue-700">
                          {doctor.name.split(" ").map((name) => name[0]).join("").slice(0, 2)}
                        </span>
                        <div>
                          <p className="font-bold">{doctor.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {t("booking.consultationDuration", {
                              duration: doctor.consultation_duration,
                            })}
                          </p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
              )}
            </div>
            )}

            {doctorId && <hr className="border-border/80" />}

            {doctorId && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
                  <h3 className="text-sm font-extrabold uppercase tracking-widest text-muted-foreground">
                    {t("booking.sectionSelectDay")}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {availableDays.map((day) => {
                    const selected = appointmentDate === day.date
                    const parsed = new Date(`${day.date}T00:00:00`)
                    return (
                      <button
                        key={day.date}
                        type="button"
                        onClick={() => setAppointmentDate(day.date)}
                        className={cn(
                          "min-w-32 rounded-2xl border px-4 py-3 text-left transition-all",
                          selected
                            ? "border-violet-500 bg-violet-500/10 ring-2 ring-violet-500/20"
                            : "border-border hover:border-violet-500/40"
                        )}
                      >
                        <p className="text-xs font-bold uppercase text-muted-foreground">
                          {parsed.toLocaleDateString(language === "sw" ? "sw-TZ" : "en-US", { weekday: "short" })}
                        </p>
                        <p className="mt-1 font-bold">
                          {parsed.toLocaleDateString(language === "sw" ? "sw-TZ" : "en-US", { day: "numeric", month: "short" })}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {t("booking.availableCount", { count: day.slot_count })}
                        </p>
                      </button>
                    )
                  })}
                  {!loadingAvailability && availableDays.length === 0 && (
                    <p className="rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
                      {t("booking.noDays")}
                    </p>
                  )}
                </div>
              </div>
            )}

            {appointmentDate && <hr className="border-border/80" />}

            {appointmentDate && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
                  <h3 className="text-sm font-extrabold uppercase tracking-widest text-muted-foreground">
                    {t("booking.sectionSelectTime")}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot.start_time}
                      type="button"
                      onClick={() => setStartTime(slot.start_time)}
                      className={cn(
                        "rounded-xl border px-5 py-3 text-sm font-bold transition-all",
                        startTime === slot.start_time
                          ? "border-emerald-500 bg-emerald-500 text-white shadow-md"
                          : "border-border hover:border-emerald-500/50 hover:bg-emerald-500/5"
                      )}
                    >
                      {slot.start_time}–{slot.end_time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {startTime && <hr className="border-border/80" />}

            {/* SECTION 3: DESCRIPTION */}
            {startTime && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
                <h3 className="text-sm font-extrabold uppercase tracking-widest text-muted-foreground opacity-90">{t("booking.sectionClinicalPresentation")}</h3>
              </div>
              <div className="space-y-2 relative group">
                <Label htmlFor="description">{t("booking.describeSymptoms")} <span className="text-rose-500">*</span></Label>
                <div className="relative">
                  <HugeiconsIcon 
                    icon={MedicineBottle01Icon} 
                    className="absolute left-4 top-4 w-5 h-5 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" 
                  />
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t("booking.descriptionPlaceholder")}
                    className="min-h-40 rounded-2xl pl-12 pt-4 border border-border bg-background focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all text-sm leading-relaxed resize-none"
                  />
                </div>
              </div>
            </div>
            )}

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row sm:justify-end gap-4 pt-6 border-t border-border/80">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="rounded-md h-10 px-5 font-bold border-border text-muted-foreground hover:text-foreground flex items-center justify-center gap-2"
              >
                <HugeiconsIcon icon={Cancel01Icon} className="h-5 w-5" />
                {t("booking.clearForm")}
              </Button>
              
              <Button
                type="submit"
                disabled={!isValid || submitting}
                className="rounded-md h-10 px-5 font-bold shadow-lg shadow-emerald-500/10 bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2"
              >
                {submitting ? (
                    t("booking.bookingAppointment")
                ) : (
                  <>
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} className="h-5 w-5" />
                    {t("booking.reviewAppointment")}
                  </>
                )}
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>

      <Dialog open={summaryOpen} onOpenChange={setSummaryOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">{t("booking.summaryTitle")}</DialogTitle>
            <DialogDescription>
              {t("booking.summaryDescription")}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              [t("booking.department"), selectedCategory?.name || "—"],
              [t("booking.doctor"), selectedDoctor?.name || "—"],
              [t("booking.date"), appointmentDate || "—"],
              [
                t("booking.time"),
                selectedSlot
                  ? `${selectedSlot.start_time}–${selectedSlot.end_time}`
                  : "—",
              ],
              [
                t("booking.duration"),
                selectedDoctor
                  ? t("booking.consultationDuration", {
                      duration: selectedDoctor.consultation_duration,
                    })
                  : "—",
              ],
              [t("booking.nextStep"), t("booking.appointmentPayment")],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border bg-muted/20 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                  {label}
                </p>
                <p className="mt-2 font-bold">{value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border p-4">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
              {t("booking.clinicalNote")}
            </p>
            <p className="mt-2 text-sm leading-6">{description}</p>
          </div>

          <button
            type="button"
            onClick={() => setReadyToPay((current) => !current)}
            className={cn(
              "flex items-center gap-3 rounded-xl border p-4 text-left transition-all",
              readyToPay
                ? "border-emerald-500 bg-emerald-500/10"
                : "border-border hover:bg-muted/40"
            )}
          >
            <span
              className={cn(
                "flex size-6 items-center justify-center rounded-md border",
                readyToPay
                  ? "border-emerald-500 bg-emerald-500 text-white"
                  : "border-border"
              )}
            >
              {readyToPay ? "✓" : ""}
            </span>
              <span>
              <span className="block font-bold">{t("booking.confirmAppointmentToggle")}</span>
              <span className="block text-sm text-muted-foreground">
                {t("booking.confirmAppointmentToggleHelp")}
              </span>
            </span>
          </button>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setSummaryOpen(false)}
              disabled={submitting}
            >
              {t("booking.changeSelection")}
            </Button>
            <Button
              onClick={confirmAppointment}
              disabled={!readyToPay || submitting}
              className="bg-emerald-600 text-white hover:bg-emerald-500"
            >
              {submitting
                ? t("booking.creatingAppointment")
                : t("booking.confirmContinuePayment")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
