"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  HeartPulse,
  MapPin,
  Search,
  ShieldCheck,
  UserRound,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import api from "@/api/axios"
import { API_ENDPOINTS } from "@/api/endpoints"
import { useTranslation } from "@/lib/i18n"

type StaffRole = "admin" | "receptionist"

type PatientRecord = {
  uuid: string
  first_name: string
  last_name: string
  email: string
  phone: string
  is_active: boolean
  patient_profile?: {
    patient_id?: string
    dob?: string
    gender?: string
    education?: string
    country?: string
    religion?: string
    tribe?: string
    marital_status?: string
    occupation?: string
    region?: string
    district?: string
    ward?: string
    residence?: string
    blood_group?: string
    insurance_provider?: string
    insurance_number?: string
    nida_number?: string
    is_profile_complete?: boolean
    next_of_kin?: {
      name?: string
      phone?: string
      relationship?: string
    }
  }
}

function Field({
  label,
  value,
}: {
  label: string
  value?: string | null
}) {
  const { t } = useTranslation()
  return (
    <div className="rounded-xl border bg-muted/10 p-3">
      <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold">{value || t("common.none")}</p>
    </div>
  )
}

export function StaffPatientProfile({
  patientUuid,
  role,
}: {
  patientUuid: string
  role: StaffRole
}) {
  const { t } = useTranslation()
  const router = useRouter()
  const [patient, setPatient] = useState<PatientRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    void (async () => {
      try {
        const response = await api.get<PatientRecord>(
          `${API_ENDPOINTS.ADMIN_USERS}${patientUuid}/`
        )
        setPatient(response.data)
      } catch {
        setError(t("staffPatientProfile.loadError"))
      } finally {
        setLoading(false)
      }
    })()
  }, [patientUuid, t])

  const searchPath =
    role === "admin"
      ? "/dashboard/search"
      : "/receptionist-dashboard/search"

  if (loading) {
    return (
      <div className="mx-auto min-h-80 w-full max-w-8xl animate-pulse rounded-3xl bg-muted/30" />
    )
  }

  if (error || !patient) {
    return (
      <div className="mx-auto flex min-h-80 w-full max-w-8xl flex-col items-center justify-center gap-4 rounded-3xl border p-8 text-center">
        <p className="font-semibold">{error || t("staffPatientProfile.notFound")}</p>
        <Button variant="outline" onClick={() => router.push(searchPath)}>
          {t("staffPatientProfile.backToSearch")}
        </Button>
      </div>
    )
  }

  const profile = patient.patient_profile
  const fullName = `${patient.first_name} ${patient.last_name}`.trim()

  return (
    <div className="mx-auto w-full max-w-8xl space-y-6 p-4 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="outline" onClick={() => router.push(searchPath)}>
          <ArrowLeft className="size-4" />
          {t("staffPatientProfile.backToSearch")}
        </Button>
        <Badge variant={profile?.is_profile_complete ? "default" : "secondary"}>
          {profile?.is_profile_complete
            ? t("staffPatientProfile.profileComplete")
            : t("staffPatientProfile.profileIncomplete")}
        </Badge>
      </div>

      <Card className="overflow-hidden rounded-3xl">
        <div className="bg-gradient-to-br from-primary/15 via-background to-blue-500/10 p-6 md:p-8">
          <div className="flex items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-3xl bg-primary text-primary-foreground">
              <UserRound className="size-8" />
            </div>
            <div>
              <p className="font-mono text-xs text-muted-foreground">
                {t("search.patientNumber", {
                  id: profile?.patient_id || t("appointments.pending"),
                })}
              </p>
              <h1 className="text-3xl font-black tracking-tight">{fullName}</h1>
              <p className="text-sm text-muted-foreground">{patient.email}</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserRound className="size-5 text-primary" />
              {t("staffPatientProfile.personalInformation")}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Field label={t("staffPatientProfile.fullName")} value={fullName} />
            <Field label={t("common.phone")} value={patient.phone} />
            <Field label={t("search.dateOfBirth")} value={profile?.dob} />
            <Field label={t("patients.gender")} value={profile?.gender} />
            <Field label={t("staffPatientProfile.maritalStatus")} value={profile?.marital_status} />
            <Field label={t("staffPatientProfile.occupation")} value={profile?.occupation} />
            <Field label={t("staffPatientProfile.education")} value={profile?.education} />
            <Field label={t("staffPatientProfile.nidaNumber")} value={profile?.nida_number} />
          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="size-5 text-primary" />
              {t("staffPatientProfile.addressLocation")}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Field label={t("patientProfile.country")} value={profile?.country} />
            <Field label={t("patientProfile.region")} value={profile?.region} />
            <Field label={t("patientProfile.councilDistrict")} value={profile?.district} />
            <Field label={t("patientProfile.ward")} value={profile?.ward} />
            <div className="sm:col-span-2">
              <Field label={t("patientProfile.residenceDetail")} value={profile?.residence} />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HeartPulse className="size-5 text-primary" />
              {t("staffPatientProfile.healthInsurance")}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Field label={t("search.bloodGroup")} value={profile?.blood_group} />
            <Field label={t("search.insurance")} value={profile?.insurance_provider} />
            <div className="sm:col-span-2">
              <Field label={t("staffPatientProfile.insuranceNumber")} value={profile?.insurance_number} />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-primary" />
              {t("patients.emergencyContact")}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Field label={t("common.name")} value={profile?.next_of_kin?.name} />
            <Field label={t("patientProfile.relationship")} value={profile?.next_of_kin?.relationship} />
            <div className="sm:col-span-2">
              <Field label={t("common.phone")} value={profile?.next_of_kin?.phone} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button variant="outline" onClick={() => router.push(searchPath)}>
          <Search className="size-4" />
          {t("staffPatientProfile.selectAnotherPatient")}
        </Button>
      </div>
    </div>
  )
}
