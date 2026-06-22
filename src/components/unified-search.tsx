"use client"

import React, { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search01Icon, UserCircleIcon, Calendar01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { format } from "date-fns"
import api from "@/api/axios"
import { API_ENDPOINTS } from "@/api/endpoints"
import { useAuthUserStore } from "@/store/auth/userAuth.store"

// Roles that can search patients via the admin users list
const PATIENT_SEARCH_ROLES = ["admin", "receptionist"]

// ─── Types ──────────────────────────────────────────────────────────────────

type SearchAppointment = {
  uuid: string
  appointment_id?: string
  patient_name: string
  patient_email?: string
  doctor_name?: string
  appointment_date?: string
  start_time?: string
  end_time?: string
  illness_category?: string
  payment_status?: string
  status: string
}

type SearchPatient = {
  uuid: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  patient_profile?: {
    patient_id?: string
    gender?: string
    dob?: string
    blood_group?: string
    insurance_provider?: string
  }
}

type SearchState<T> = T | "not_found" | null

// ─── Helpers ─────────────────────────────────────────────────────────────────

function statusVariant(
  status: string
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "completed":
      return "default"
    case "accepted":
      return "secondary"
    case "cancelled":
    case "declined":
    case "expired":
      return "destructive"
    default:
      return "outline"
  }
}

function paymentVariant(
  status?: string
): "default" | "secondary" | "destructive" | "outline" {
  if (status === "completed") return "default"
  if (status === "failed") return "destructive"
  return "outline"
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SearchForm({
  placeholder,
  value,
  loading,
  onChange,
  onSubmit,
}: {
  placeholder: string
  value: string
  loading: boolean
  onChange: (v: string) => void
  onSubmit: (e: React.FormEvent) => void
}) {
  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="max-w-xs font-mono tracking-widest uppercase"
        maxLength={6}
      />
      <Button type="submit" disabled={loading || value.trim().length === 0}>
        {loading ? (
          "Searching…"
        ) : (
          <>
            <HugeiconsIcon icon={Search01Icon} className="w-4 h-4 mr-2" />
            Search
          </>
        )}
      </Button>
    </form>
  )
}

function NotFound({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-muted-foreground">
      <p className="text-sm">No {label} found with that ID.</p>
      <p className="text-xs">Double-check the 6-character code and try again.</p>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </span>
      <span className="text-sm font-medium">{value ?? "—"}</span>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function UnifiedSearch() {
  const user = useAuthUserStore((state) => state.user)
  const canSearchPatients = PATIENT_SEARCH_ROLES.includes(user?.role ?? "")

  const [appointmentQuery, setAppointmentQuery] = useState("")
  const [patientQuery, setPatientQuery] = useState("")
  const [appointmentResult, setAppointmentResult] = useState<SearchState<SearchAppointment>>(null)
  const [patientResult, setPatientResult] = useState<SearchState<SearchPatient>>(null)
  const [appointmentLoading, setAppointmentLoading] = useState(false)
  const [patientLoading, setPatientLoading] = useState(false)

  // ── Appointment Search ────────────────────────────────────────────────────

  const handleSearchAppointment = async (e: React.FormEvent) => {
    e.preventDefault()
    const q = appointmentQuery.trim().toUpperCase()
    if (!q) return

    setAppointmentLoading(true)
    setAppointmentResult(null)
    try {
      const { data } = await api.get<SearchAppointment[]>(API_ENDPOINTS.APPOINTMENTS, {
        params: { search: q },
      })
      setAppointmentResult(data && data.length > 0 ? data[0] : "not_found")
    } catch {
      setAppointmentResult("not_found")
    } finally {
      setAppointmentLoading(false)
    }
  }

  // ── Patient Search ────────────────────────────────────────────────────────

  const handleSearchPatient = async (e: React.FormEvent) => {
    e.preventDefault()
    const q = patientQuery.trim().toUpperCase()
    if (!q) return

    setPatientLoading(true)
    setPatientResult(null)
    try {
      const { data } = await api.get<SearchPatient[]>(API_ENDPOINTS.ADMIN_USERS, {
        params: { role: "patient", search: q },
      })
      setPatientResult(data && data.length > 0 ? data[0] : "not_found")
    } catch {
      setPatientResult("not_found")
    } finally {
      setPatientLoading(false)
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Quick Search</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Look up appointments or patients using their unique 6-character ID.
        </p>
      </div>

      <Tabs defaultValue="appointments" className="w-full">
        <TabsList className={`grid w-full ${canSearchPatients ? "grid-cols-2" : "grid-cols-1"}`}>
          <TabsTrigger value="appointments" className="gap-2">
            <HugeiconsIcon icon={Calendar01Icon} className="w-4 h-4" />
            Appointments
          </TabsTrigger>
          {canSearchPatients && (
            <TabsTrigger value="patients" className="gap-2">
              <HugeiconsIcon icon={UserCircleIcon} className="w-4 h-4" />
              Patients
            </TabsTrigger>
          )}
        </TabsList>

        {/* ── Appointments Tab ─────────────────────────────────────────────── */}
        <TabsContent value="appointments" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Search Appointments</CardTitle>
              <CardDescription>
                Enter the 6-character appointment ID (e.g.{" "}
                <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">A1B2C3</code>
                ) to retrieve full details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <SearchForm
                placeholder="Appointment ID…"
                value={appointmentQuery}
                loading={appointmentLoading}
                onChange={setAppointmentQuery}
                onSubmit={handleSearchAppointment}
              />

              {appointmentResult === "not_found" && (
                <NotFound label="appointment" />
              )}

              {appointmentResult && appointmentResult !== "not_found" && (
                <div className="border rounded-lg p-6 space-y-5">
                  {/* Title row */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-base font-semibold">Appointment Details</h3>
                      <p className="text-xs text-muted-foreground font-mono mt-0.5">
                        ID: {appointmentResult.appointment_id ?? appointmentResult.uuid}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-wrap justify-end">
                      <Badge variant={statusVariant(appointmentResult.status)}>
                        {appointmentResult.status}
                      </Badge>
                      {appointmentResult.payment_status && (
                        <Badge variant={paymentVariant(appointmentResult.payment_status)}>
                          {appointmentResult.payment_status}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                    <DetailRow label="Patient" value={appointmentResult.patient_name} />
                    <DetailRow label="Doctor" value={appointmentResult.doctor_name ?? "Unassigned"} />
                    <DetailRow
                      label="Date"
                      value={
                        appointmentResult.appointment_date
                          ? format(new Date(appointmentResult.appointment_date), "PP")
                          : "Not scheduled"
                      }
                    />
                    <DetailRow
                      label="Time"
                      value={
                        appointmentResult.start_time && appointmentResult.end_time
                          ? `${appointmentResult.start_time} – ${appointmentResult.end_time}`
                          : "N/A"
                      }
                    />
                    <DetailRow label="Category" value={appointmentResult.illness_category} />
                    <DetailRow label="Patient Email" value={appointmentResult.patient_email} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Patients Tab ──────────────────────────────────────────────────── */}
        {canSearchPatients && (
        <TabsContent value="patients" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Search Patients</CardTitle>
              <CardDescription>
                Enter the 6-character patient ID (e.g.{" "}
                <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">P9X4YZ</code>
                ) to retrieve profile details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <SearchForm
                placeholder="Patient ID…"
                value={patientQuery}
                loading={patientLoading}
                onChange={setPatientQuery}
                onSubmit={handleSearchPatient}
              />

              {patientResult === "not_found" && (
                <NotFound label="patient" />
              )}

              {patientResult && patientResult !== "not_found" && (
                <div className="border rounded-lg p-6 space-y-5">
                  {/* Title row */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-base font-semibold">Patient Profile</h3>
                      <p className="text-xs text-muted-foreground font-mono mt-0.5">
                        ID: {patientResult.patient_profile?.patient_id ?? "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                    <DetailRow
                      label="Full Name"
                      value={`${patientResult.first_name} ${patientResult.last_name}`.trim()}
                    />
                    <DetailRow label="Email" value={patientResult.email} />
                    <DetailRow label="Phone" value={patientResult.phone} />
                    <DetailRow label="Gender" value={patientResult.patient_profile?.gender} />
                    <DetailRow label="Date of Birth" value={patientResult.patient_profile?.dob} />
                    <DetailRow label="Blood Group" value={patientResult.patient_profile?.blood_group} />
                    <DetailRow
                      label="Insurance Provider"
                      value={patientResult.patient_profile?.insurance_provider}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
