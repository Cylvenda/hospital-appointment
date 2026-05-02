"use client"

import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useAppointmentStore } from "@/store/appointments/appointment.store"

type Step = 1 | 2 | 3

export default function PatientAppointmentsPage() {
  const {
    illnessCategories,
    fetchAppointments,
    fetchIllnessCategories,
    createAppointment,
  } = useAppointmentStore()

  const [step, setStep] = useState<Step>(1)

  const [illnessCategoryId, setIllnessCategoryId] = useState("")
  const [appointmentPreferredDate, setAppointmentPreferredDate] = useState("")
  const [description, setDescription] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    void fetchAppointments()
    void fetchIllnessCategories()
  }, [fetchAppointments, fetchIllnessCategories])

  const nextStep = () => setStep((s) => (s < 3 ? ((s + 1) as Step) : s))
  const prevStep = () => setStep((s) => (s > 1 ? ((s - 1) as Step) : s))

  const canProceedStep1 = !!illnessCategoryId
  const canProceedStep2 = !!appointmentPreferredDate
  const canSubmit = !!description.trim()

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return

    setSubmitting(true)
    try {
      await createAppointment({
        illnessCategoryId,
        appointmentPreferredDate,
        description: description.trim(),
      })

      toast.success("Appointment created successfully.")

      // reset
      setStep(1)
      setIllnessCategoryId("")
      setAppointmentPreferredDate("")
      setDescription("")
    } catch {
      toast.error("Failed to create appointment.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-8xl mx-auto space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Book Appointment</h1>
        <p className="text-sm text-muted-foreground">
          Follow the steps to request a consultation with a doctor.
        </p>
      </div>

      {/* PROGRESS */}
      <div className="flex items-center gap-2 text-sm">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-2 flex-1 rounded-full ${step >= s ? "bg-primary" : "bg-muted"
              }`}
          />
        ))}
      </div>

      {/* CARD */}
      <Card className="rounded-md">
        <CardHeader>
          <CardTitle>
            Step {step} of 3
          </CardTitle>
          <CardDescription>
            {step === 1 && "Select your illness category"}
            {step === 2 && "Choose your preferred appointment date"}
            {step === 3 && "Describe your condition"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Illness Category</label>
              <Select value={illnessCategoryId} onValueChange={setIllnessCategoryId}>
                <SelectTrigger className="rounded-md w-full" >
                  <SelectValue  placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="rounded-md">
                  {illnessCategories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                className="w-full mt-4 rounded-md"
                disabled={!canProceedStep1}
                onClick={nextStep}
              >
                Continue
              </Button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Preferred Date</label>
              <Input
                className="rounded-md"
                type="date"
                value={appointmentPreferredDate}
                onChange={(e) => setAppointmentPreferredDate(e.target.value)}
              />

              <div className="flex gap-2 pt-4 rounded-md">
                <Button variant="outline" onClick={prevStep} className="rounded-md">
                  Back
                </Button>

                <Button
                  className="flex-1 rounded-md"
                  disabled={!canProceedStep2}
                  onClick={nextStep}
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Describe Your Condition
              </label>

              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain your symptoms in detail..."
                className="min-h-32.5 rounded-md"
              />

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={prevStep} className="rounded-md" >
                  Back
                </Button>

                <Button
                  className="flex-1 rounded-md"
                  disabled={!canSubmit || submitting}
                  onClick={handleSubmit}
                >
                  {submitting ? "Submitting..." : "Submit Appointment"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}