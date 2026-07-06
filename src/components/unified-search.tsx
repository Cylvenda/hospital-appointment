"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  CalendarDays,
  ClipboardList,
  Search,
  Stethoscope,
  UserRound,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import api from "@/api/axios"
import { API_ENDPOINTS } from "@/api/endpoints"
import { useAuthUserStore } from "@/store/auth/userAuth.store"
import { useTranslation } from "@/lib/i18n"

const PATIENT_SEARCH_ROLES = ["admin", "receptionist"]

type PatientProfileSummary = {
  uuid?: string
  patient_id?: string
  dob?: string
  gender?: string
  region?: string
  district?: string
  ward?: string
  residence?: string
  blood_group?: string
  insurance_provider?: string
  insurance_number?: string
  is_profile_complete?: boolean
  next_of_kin?: {
    name?: string
    phone?: string
    relationship?: string
  } | null
}

type SearchAppointment = {
  uuid: string
  appointment_id?: string
  patient_uuid: string
  patient_name: string
  patient_email?: string
  patient_phone?: string
  patient_profile?: PatientProfileSummary | null
  doctor_name?: string
  appointment_date?: string
  start_time?: string
  end_time?: string
  illness_category?: string
  payment_status?: string
  status: string
  fee?: string
  description?: string
  diagnosis?: string
  notes?: string
  queue_number?: number
}

type SearchPatient = {
  uuid: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  is_active?: boolean
  patient_profile?: PatientProfileSummary
}

type SearchState<T> = T | "not_found" | null

function badgeVariant(
  status?: string
): "default" | "secondary" | "destructive" | "outline" {
  if (status === "completed" || status === "confirmed") return "default"
  if (status === "cancelled" || status === "no_show" || status === "failed") {
    return "destructive"
  }
  if (
    status === "waiting_in_queue" ||
    status === "in_consultation" ||
    status === "back_to_doctor"
  ) {
    return "secondary"
  }
  return "outline"
}

function labelStatus(value?: string) {
  return value?.replaceAll("_", " ") || "Unknown"
}

function DetailRow({
  label,
  value,
}: {
  label: string
  value?: React.ReactNode
}) {
  return (
    <div className="rounded-xl border bg-muted/10 p-3">
      <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div className="mt-1 text-sm font-semibold">{value || "—"}</div>
    </div>
  )
}

function SearchForm({
  placeholder,
  value,
  loading,
  buttonLabel,
  loadingLabel,
  onChange,
  onSubmit,
}: {
  placeholder: string
  value: string
  loading: boolean
  buttonLabel: string
  loadingLabel: string
  onChange: (value: string) => void
  onSubmit: (event: React.FormEvent) => void
}) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row">
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value.toUpperCase())}
        className="h-11 max-w-sm rounded-xl font-mono tracking-widest uppercase"
        maxLength={6}
      />
      <Button type="submit" disabled={loading || !value.trim()}>
        <Search className="size-4" />
        {loading ? loadingLabel : buttonLabel}
      </Button>
    </form>
  )
}

function NotFound({
  title,
  help,
}: {
  title: string
  help: string
}) {
  return (
    <div className="rounded-2xl border border-dashed py-12 text-center">
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{help}</p>
    </div>
  )
}

export function UnifiedSearch() {
  const { t, language } = useTranslation()
  const router = useRouter()
  const role = useAuthUserStore((state) => state.user?.role)
  const canSearchPatients = PATIENT_SEARCH_ROLES.includes(role ?? "")
  const [appointmentQuery, setAppointmentQuery] = useState("")
  const [patientQuery, setPatientQuery] = useState("")
  const [appointmentResult, setAppointmentResult] =
    useState<SearchState<SearchAppointment>>(null)
  const [patientResult, setPatientResult] =
    useState<SearchState<SearchPatient>>(null)
  const [appointmentLoading, setAppointmentLoading] = useState(false)
  const [patientLoading, setPatientLoading] = useState(false)

  const appointmentPath = (uuid: string) => {
    if (role === "doctor") return `/doctor-dashboard/appointments/${uuid}`
    if (role === "receptionist") {
      return `/receptionist-dashboard/appointments/${uuid}`
    }
    return `/appointments/${uuid}`
  }

  const patientPath = (uuid: string) =>
    role === "receptionist"
      ? `/receptionist-dashboard/patients/${uuid}`
      : `/patients/${uuid}`

  const searchAppointment = async (event: React.FormEvent) => {
    event.preventDefault()
    const query = appointmentQuery.trim()
    if (!query) return
    setAppointmentLoading(true)
    setAppointmentResult(null)
    try {
      const { data } = await api.get<SearchAppointment[]>(
        API_ENDPOINTS.APPOINTMENTS,
        { params: { search: query } }
      )
      setAppointmentResult(data[0] ?? "not_found")
    } catch {
      setAppointmentResult("not_found")
    } finally {
      setAppointmentLoading(false)
    }
  }

  const searchPatient = async (event: React.FormEvent) => {
    event.preventDefault()
    const query = patientQuery.trim()
    if (!query) return
    setPatientLoading(true)
    setPatientResult(null)
    try {
      const { data } = await api.get<SearchPatient[]>(
        API_ENDPOINTS.ADMIN_USERS,
        { params: { role: "patient", search: query } }
      )
      setPatientResult(data[0] ?? "not_found")
    } catch {
      setPatientResult("not_found")
    } finally {
      setPatientLoading(false)
    }
  }

  const appointment =
    appointmentResult && appointmentResult !== "not_found"
      ? appointmentResult
      : null
  const patient =
    patientResult && patientResult !== "not_found" ? patientResult : null
  const locale = language === "sw" ? "sw-TZ" : "en-US"

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">
          {t("search.recordLookup")}
        </p>
        <h1 className="mt-1 text-3xl font-black tracking-tight">{t("search.quickSearch")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("search.description")}
        </p>
      </div>

      <Tabs defaultValue="appointments">
        <TabsList className={canSearchPatients ? "grid w-full grid-cols-2" : "w-full"}>
          <TabsTrigger value="appointments">
            <CalendarDays className="size-4" /> {t("search.appointmentsTab")}
          </TabsTrigger>
          {canSearchPatients && (
            <TabsTrigger value="patients">
              <UserRound className="size-4" /> {t("search.patientsTab")}
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="appointments" className="mt-6">
            <Card className="rounded-3xl">
              <CardHeader>
              <CardTitle>{t("search.searchByAppointmentId")}</CardTitle>
              <CardDescription>
                {t("search.appointmentSearchDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <SearchForm
                placeholder={t("search.appointmentIdPlaceholder")}
                value={appointmentQuery}
                loading={appointmentLoading}
                buttonLabel={t("common.search")}
                loadingLabel={t("search.searching")}
                onChange={setAppointmentQuery}
                onSubmit={searchAppointment}
              />
              {appointmentResult === "not_found" && (
                <NotFound
                  title={t("search.appointmentNotFound")}
                  help={t("search.notFoundHelp")}
                />
              )}
              {appointment && (
                <div className="space-y-5 rounded-2xl border p-4 md:p-6">
                  <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-mono text-muted-foreground">
                        {t("search.appointmentNumber", {
                          id: appointment.appointment_id || "",
                        })}
                      </p>
                      <h2 className="mt-1 text-xl font-black">
                        {appointment.patient_name}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {t("search.patientNumber", {
                          id:
                            appointment.patient_profile?.patient_id ||
                            t("search.notAssigned"),
                        })}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant={badgeVariant(appointment.status)}>
                        {labelStatus(appointment.status)}
                      </Badge>
                      <Badge variant={badgeVariant(appointment.payment_status)}>
                        {t("search.paymentStatus", {
                          status: labelStatus(appointment.payment_status),
                        })}
                      </Badge>
                      {appointment.queue_number && (
                        <Badge>{t("search.queueNumber", { number: appointment.queue_number })}</Badge>
                      )}
                    </div>
                  </div>

                  <section className="space-y-3">
                    <h3 className="flex items-center gap-2 font-black">
                      <ClipboardList className="size-4 text-primary" />
                      {t("search.appointmentSection")}
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      <DetailRow label={t("search.department")} value={appointment.illness_category} />
                      <DetailRow label={t("search.doctor")} value={appointment.doctor_name || t("search.notAssigned")} />
                      <DetailRow
                        label={t("search.date")}
                        value={
                          appointment.appointment_date
                            ? new Date(
                                `${appointment.appointment_date}T00:00:00`
                              ).toLocaleDateString(locale, {
                                dateStyle: "medium",
                              })
                            : t("search.notScheduled")
                        }
                      />
                      <DetailRow
                        label={t("search.time")}
                        value={
                          appointment.start_time
                            ? `${appointment.start_time.slice(0, 5)}–${appointment.end_time?.slice(0, 5) || ""}`
                            : t("search.notScheduled")
                        }
                      />
                      <DetailRow label={t("search.fee")} value={appointment.fee ? `TZS ${appointment.fee}` : undefined} />
                    </div>
                  </section>

                  <section className="space-y-3">
                    <h3 className="flex items-center gap-2 font-black">
                      <UserRound className="size-4 text-primary" />
                      {t("search.patientProfileSection")}
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      <DetailRow label={t("search.email")} value={appointment.patient_email} />
                      <DetailRow label={t("search.phone")} value={appointment.patient_phone} />
                      <DetailRow label={t("search.gender")} value={appointment.patient_profile?.gender} />
                      <DetailRow label={t("search.dateOfBirth")} value={appointment.patient_profile?.dob} />
                      <DetailRow label={t("search.bloodGroup")} value={appointment.patient_profile?.blood_group} />
                      <DetailRow
                        label={t("search.location")}
                        value={[
                          appointment.patient_profile?.ward,
                          appointment.patient_profile?.district,
                          appointment.patient_profile?.region,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      />
                      <DetailRow
                        label={t("search.insurance")}
                        value={appointment.patient_profile?.insurance_provider}
                      />
                      <DetailRow
                        label={t("search.nextOfKin")}
                        value={
                          appointment.patient_profile?.next_of_kin
                            ? `${appointment.patient_profile.next_of_kin.name} · ${appointment.patient_profile.next_of_kin.phone}`
                            : undefined
                        }
                      />
                    </div>
                  </section>

                  <section className="space-y-3">
                    <h3 className="flex items-center gap-2 font-black">
                      <Stethoscope className="size-4 text-primary" />
                      {t("search.clinicalContextSection")}
                    </h3>
                    <div className="grid gap-3 md:grid-cols-3">
                      <DetailRow label={t("search.patientPresentation")} value={appointment.description} />
                      <DetailRow label={t("search.diagnosis")} value={appointment.diagnosis} />
                      <DetailRow label={t("search.clinicalNotes")} value={appointment.notes} />
                    </div>
                  </section>

                  <div className="flex flex-wrap justify-end gap-3 border-t pt-5">
                    {canSearchPatients && (
                      <Button
                        variant="outline"
                        onClick={() => router.push(patientPath(appointment.patient_uuid))}
                      >
                        <UserRound className="size-4" />
                        {t("search.selectPatientProfile")}
                      </Button>
                    )}
                    {["admin", "receptionist", "doctor"].includes(role ?? "") && (
                      <Button
                        onClick={() => router.push(appointmentPath(appointment.uuid))}
                      >
                        {t("search.viewAndWorkAppointment")}
                        <ArrowRight className="size-4" />
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {canSearchPatients && (
          <TabsContent value="patients" className="mt-6">
            <Card className="rounded-3xl">
              <CardHeader>
                <CardTitle>{t("search.searchByPatientId")}</CardTitle>
                <CardDescription>
                  {t("search.patientSearchDescription")}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <SearchForm
                  placeholder={t("search.patientIdPlaceholder")}
                  value={patientQuery}
                  loading={patientLoading}
                  buttonLabel={t("common.search")}
                  loadingLabel={t("search.searching")}
                  onChange={setPatientQuery}
                  onSubmit={searchPatient}
                />
                {patientResult === "not_found" && (
                  <NotFound
                    title={t("search.patientNotFound")}
                    help={t("search.notFoundHelp")}
                  />
                )}
                {patient && (
                  <div className="space-y-5 rounded-2xl border p-4 md:p-6">
                    <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-mono text-xs text-muted-foreground">
                          {t("search.patientNumber", {
                            id: patient.patient_profile?.patient_id || "",
                          })}
                        </p>
                        <h2 className="mt-1 text-xl font-black">
                          {patient.first_name} {patient.last_name}
                        </h2>
                      </div>
                      <Badge variant={patient.is_active ? "default" : "secondary"}>
                        {patient.is_active ? t("search.active") : t("search.inactive")}
                      </Badge>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      <DetailRow label={t("search.email")} value={patient.email} />
                      <DetailRow label={t("search.phone")} value={patient.phone} />
                      <DetailRow label={t("search.gender")} value={patient.patient_profile?.gender} />
                      <DetailRow label={t("search.dateOfBirth")} value={patient.patient_profile?.dob} />
                      <DetailRow label={t("search.bloodGroup")} value={patient.patient_profile?.blood_group} />
                      <DetailRow
                        label={t("search.location")}
                        value={[
                          patient.patient_profile?.ward,
                          patient.patient_profile?.district,
                          patient.patient_profile?.region,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      />
                      <DetailRow
                        label={t("search.insurance")}
                        value={patient.patient_profile?.insurance_provider}
                      />
                    </div>
                    <div className="flex justify-end border-t pt-5">
                      <Button onClick={() => router.push(patientPath(patient.uuid))}>
                        {t("search.selectPatientProfile")}
                        <ArrowRight className="size-4" />
                      </Button>
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
