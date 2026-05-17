"use client"

import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircleIcon, Calendar03Icon, MedicineBottle01Icon, CheckmarkCircle02Icon, Cancel01Icon, UnfoldMoreIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useAppointmentStore } from "@/store/appointments/appointment.store"
import { DatePicker } from "@/components/ui/date-picker"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

export default function PatientAppointmentsPage() {
  const router = useRouter()
  const {
    illnessCategories,
    fetchAppointments,
    fetchIllnessCategories,
    createAppointment,
  } = useAppointmentStore()

  const [illnessCategoryId, setIllnessCategoryId] = useState("")
  const [appointmentPreferredDate, setAppointmentPreferredDate] = useState("")
  const [appointmentPreferredDate2, setAppointmentPreferredDate2] = useState("")
  const [appointmentPreferredDate3, setAppointmentPreferredDate3] = useState("")
  const [description, setDescription] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    void fetchAppointments()
    void fetchIllnessCategories()
  }, [fetchAppointments, fetchIllnessCategories])

  const isValid = 
    !!illnessCategoryId && 
    !!appointmentPreferredDate && 
    !!appointmentPreferredDate2 && 
    !!appointmentPreferredDate3 && 
    !!description.trim()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid || submitting) return

    setSubmitting(true)
    try {
      await createAppointment({
        illnessCategoryId,
        appointmentPreferredDate,
        appointmentPreferredDate2,
        appointmentPreferredDate3,
        description: description.trim(),
      })

      toast.success("Appointment slot requested successfully!")

      // Reset form fields
      setIllnessCategoryId("")
      setAppointmentPreferredDate("")
      setAppointmentPreferredDate2("")
      setAppointmentPreferredDate3("")
      setDescription("")
      
      // Redirect to appointments list or main dashboard
      router.push("/patient-dashboard")
    } catch {
      toast.error("Failed to create appointment.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleReset = () => {
    setIllnessCategoryId("")
    setAppointmentPreferredDate("")
    setAppointmentPreferredDate2("")
    setAppointmentPreferredDate3("")
    setDescription("")
    toast.info("Form fields cleared.")
  }

  return (
    <div className="w-full max-w-8xl mx-auto space-y-5 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">Request Appointment</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Fill in your preferred dates and clinical symptoms to schedule a professional consultation.
          </p>
        </div>
        <Button 
          variant="outline"
          type="button"
          onClick={() => router.push("/patient-dashboard")}
          className="rounded-xl h-11 px-5 font-bold transition-all border-border hover:bg-muted/40"
        >
          Back to Dashboard
        </Button>
      </div>

      {/* ANNOUNCEMENT BANNER */}
      <div className="flex items-center gap-4 p-3 bg-sky-500/10 dark:bg-sky-950/20 border border-sky-500/20 rounded-2xl text-sky-800 dark:text-sky-300 shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
          <HugeiconsIcon icon={AlertCircleIcon} className="w-6 h-6" />
        </div>
        <p className="text-sm leading-relaxed">
          <span className="font-bold">Note:</span> Basic screening and routine measurements are available as walk-in services and cannot be booked online.
        </p>
      </div>

      {/* SINGLE FORM CONTAINER */}
      <Card className="rounded-md border border-border bg-card shadow-xl shadow-foreground/[0.02] overflow-hidden">
        <CardHeader className="p-8 pb-6 border-b border-border/80 bg-muted/20">
          <CardTitle className="text-xl font-bold flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <HugeiconsIcon icon={Calendar03Icon} className="w-5 h-5" />
            </span>
            Appointment Request Details
          </CardTitle>
          <CardDescription>
            All fields are mandatory. Please provide genuine clinical details.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-5">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* SECTION 1: CLINICAL CATEGORY */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
                <h3 className="text-sm font-extrabold uppercase tracking-widest text-muted-foreground opacity-90">
                  1. Clinical Classification
                </h3>
              </div>
              <div className="space-y-2 max-w-xl">
                <Label htmlFor="category">Illness Category <span className="text-rose-500">*</span></Label>
                <Select value={illnessCategoryId} onValueChange={setIllnessCategoryId}>
                  <SelectTrigger id="category" className="rounded-xl h-12 w-full text-left">
                    <SelectValue placeholder="Select primary symptoms category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {illnessCategories.map((c) => (
                      <SelectItem key={c.id} value={c.id} className="rounded-lg my-0.5">
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <hr className="border-border/80" />

            {/* SECTION 2: PREFERRED DATES */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
                <h3 className="text-sm font-extrabold uppercase tracking-widest text-muted-foreground opacity-90">
                  2. Availability Preferences
                </h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
                Provide three different potential dates you are available to attend your consultation. Our scheduling team will assign you to the best matching slot.
              </p>
              
              <div className="grid gap-6 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Choice 1 <span className="text-rose-500">*</span></Label>
                  <DatePicker
                    className="rounded-xl h-12"
                    placeholder="Select Date Choice 1"
                    value={appointmentPreferredDate}
                    onChange={setAppointmentPreferredDate}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Choice 2 <span className="text-rose-500">*</span></Label>
                  <DatePicker
                    className="rounded-xl h-12"
                    placeholder="Select Date Choice 2"
                    value={appointmentPreferredDate2}
                    onChange={setAppointmentPreferredDate2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Choice 3 <span className="text-rose-500">*</span></Label>
                  <DatePicker
                    className="rounded-xl h-12"
                    placeholder="Select Date Choice 3"
                    value={appointmentPreferredDate3}
                    onChange={setAppointmentPreferredDate3}
                  />
                </div>
              </div>
            </div>

            <hr className="border-border/80" />

            {/* SECTION 3: DESCRIPTION */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
                <h3 className="text-sm font-extrabold uppercase tracking-widest text-muted-foreground opacity-90">
                  3. Clinical Presentation
                </h3>
              </div>
              <div className="space-y-2 relative group">
                <Label htmlFor="description">Describe Your Symptoms <span className="text-rose-500">*</span></Label>
                <div className="relative">
                  <HugeiconsIcon 
                    icon={MedicineBottle01Icon} 
                    className="absolute left-4 top-4 w-5 h-5 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" 
                  />
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your current symptoms, pain levels, duration, or any other relevant details that will help our clinical team prepare for your visit..."
                    className="min-h-40 rounded-2xl pl-12 pt-4 border border-border bg-background focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all text-sm leading-relaxed resize-none"
                  />
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row sm:justify-end gap-4 pt-6 border-t border-border/80">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="rounded-md h-10 px-5 font-bold border-border text-muted-foreground hover:text-foreground flex items-center justify-center gap-2"
              >
                <HugeiconsIcon icon={Cancel01Icon} className="h-5 w-5" />
                Clear Form
              </Button>
              
              <Button
                type="submit"
                disabled={!isValid || submitting}
                className="rounded-md h-10 px-5 font-bold shadow-lg shadow-emerald-500/10 bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2"
              >
                {submitting ? (
                  "Submitting slot request..."
                ) : (
                  <>
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} className="h-5 w-5" />
                    Submit Appointment Request
                  </>
                )}
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  )
}