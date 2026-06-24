"use client"

import { useEffect, useMemo, useState } from "react"
import { toast } from "react-toastify"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { HugeiconsIcon } from "@hugeicons/react"
import {
     CheckCircle,
     Clock03Icon,
     PlusSignIcon,
     RefreshIcon,
     StethoscopeIcon,
     Calendar03Icon,
     FileEditIcon,
     MedicalFileIcon,
} from "@hugeicons/core-free-icons"
import type { Appointment } from "@/store/appointments/appointment.types"
import { clinicalService, type ConsultationApi, type DiagnosisApi, type LabRequestApi, type LabTestApi, type PrescriptionApi } from "@/api/services/clinical.service"
import { getAppointmentQueueForRole } from "@/lib/appointment-queues"

type Props = {
     appointment: Appointment
}

type ActionState = "idle" | "loading"

type DiagnosisForm = {
     disease_name: string
     icd10_code: string
     description: string
     type: "provisional" | "final"
}

type ConsultationForm = {
     chief_complaint: string
     history_of_present_illness: string
     physical_examination: string
     provisional_diagnosis: string
}

type ConsultationFormErrors = Partial<Record<keyof ConsultationForm, string>>

type LabResultSummary = {
     uuid: string
     request_item_uuid: string
     test_name: string
     result: string
     remarks: string
     verified_by_uuid: string
     verified_by_name: string
     verified_at: string | null
     created_at: string
     updated_at: string
}

const emptyDiagnosis: DiagnosisForm = {
     disease_name: "",
     icd10_code: "",
     description: "",
     type: "provisional",
}

const emptyConsultationForm: ConsultationForm = {
     chief_complaint: "",
     history_of_present_illness: "",
     physical_examination: "",
     provisional_diagnosis: "",
}

const emptyPrescriptionItem = {
     medicine_name: "",
     dosage: "",
     frequency: "",
     duration: "",
     instructions: "",
}

export function ClinicalWorkspace({ appointment }: Props) {
     const [consultations, setConsultations] = useState<ConsultationApi[]>([])
     const [diagnoses, setDiagnoses] = useState<DiagnosisApi[]>([])
     const [prescriptions, setPrescriptions] = useState<PrescriptionApi[]>([])
     const [labRequests, setLabRequests] = useState<LabRequestApi[]>([])
     const [labResults, setLabResults] = useState<LabResultSummary[]>([])
     const [labTests, setLabTests] = useState<LabTestApi[]>([])
     const [loading, setLoading] = useState(true)
     const [actionState, setActionState] = useState<ActionState>("idle")

     const [diagnosisForm, setDiagnosisForm] = useState<DiagnosisForm>(emptyDiagnosis)
     const [consultationForm, setConsultationForm] = useState<ConsultationForm>(emptyConsultationForm)
     const [consultationErrors, setConsultationErrors] = useState<ConsultationFormErrors>({})
     const [prescriptionNotes, setPrescriptionNotes] = useState("")
     const [prescriptionItem, setPrescriptionItem] = useState(emptyPrescriptionItem)
     const [selectedLabTestUuids, setSelectedLabTestUuids] = useState<string[]>([])
     const [selectedLabTestUuid, setSelectedLabTestUuid] = useState("")
    const consultation = useMemo(
          () => consultations.find((entry) => entry.appointment_uuid === appointment.id) ?? null,
          [appointment.id, consultations]
     )
    const isVisitOpen = getAppointmentQueueForRole(appointment, "doctor") === "in-consultation"

     const formatVerificationTime = (value: string | null) => {
          if (!value) {
               return "Pending verification"
          }

          const parsed = new Date(value)
          if (Number.isNaN(parsed.getTime())) {
               return "Pending verification"
          }

          return parsed.toLocaleString()
     }

     useEffect(() => {
          if (!consultation) {
               setConsultationForm(emptyConsultationForm)
               return
          }

          setConsultationForm({
               chief_complaint: consultation.chief_complaint || "",
               history_of_present_illness: consultation.history_of_present_illness || "",
               physical_examination: consultation.physical_examination || "",
               provisional_diagnosis: consultation.provisional_diagnosis || "",
          })
     }, [consultation])

     const consultationDiagnoses = useMemo(
          () => diagnoses.filter((diagnosis) => diagnosis.consultation_appointment_uuid === appointment.id),
          [appointment.id, diagnoses]
     )

     const consultationPrescriptions = useMemo(
          () => prescriptions.filter((prescription) => prescription.consultation_uuid === consultation?.uuid),
          [consultation?.uuid, prescriptions]
     )

     const consultationLabRequests = useMemo(
          () => labRequests.filter((request) => request.consultation_uuid === consultation?.uuid),
          [consultation?.uuid, labRequests]
     )

     const labResultsByItemId = useMemo(() => {
          return labResults.reduce<Record<string, LabResultSummary>>((acc, result) => {
               acc[result.request_item_uuid] = result
               return acc
          }, {})
     }, [labResults])

     const consultationLabRequestsWithResults = useMemo(() => {
          return consultationLabRequests.map((request) => ({
               ...request,
               items: request.items.map((item) => ({
                    ...item,
                    result: labResultsByItemId[item.uuid] ?? null,
               })),
          }))
     }, [consultationLabRequests, labResultsByItemId])

     const consultationBaseline = useMemo(
          () => ({
               chief_complaint: consultation?.chief_complaint || "",
               history_of_present_illness: consultation?.history_of_present_illness || "",
               physical_examination: consultation?.physical_examination || "",
               provisional_diagnosis: consultation?.provisional_diagnosis || "",
          }),
          [consultation]
     )

     const consultationHasChanges = useMemo(() => {
          return (
               consultationForm.chief_complaint.trim() !== consultationBaseline.chief_complaint.trim() ||
               consultationForm.history_of_present_illness.trim() !== consultationBaseline.history_of_present_illness.trim() ||
               consultationForm.physical_examination.trim() !== consultationBaseline.physical_examination.trim() ||
               consultationForm.provisional_diagnosis.trim() !== consultationBaseline.provisional_diagnosis.trim()
          )
     }, [consultationBaseline, consultationForm])

    const consultationDraftStatus = consultation ? (consultationHasChanges ? "unsaved" : "saved") : "empty"
    const lastSavedLabel = useMemo(() => {
         if (!consultation) return null

         const savedAt = new Date(consultation.updated_at)
         const elapsedMs = Date.now() - savedAt.getTime()
         if (Number.isFinite(elapsedMs) && elapsedMs < 60_000) {
              return "Updated just now"
         }

         return `Saved at ${savedAt.toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
         })}`
    }, [consultation])

     const syncConsultation = async () => {
          setConsultationErrors({})
          const payload = {
               appointment_uuid: appointment.id,
               doctor_uuid: appointment.doctorId ?? undefined,
               chief_complaint: consultationForm.chief_complaint.trim() || appointment.note || appointment.illnessCategory,
               history_of_present_illness: consultationForm.history_of_present_illness.trim(),
               physical_examination: consultationForm.physical_examination.trim(),
               provisional_diagnosis: consultationForm.provisional_diagnosis.trim(),
          }

          if (consultation) {
               const response = await clinicalService.updateConsultation(consultation.uuid, payload)
               setConsultations((current) => current.map((entry) => (entry.uuid === response.data.uuid ? response.data : entry)))
               return response.data
          }

          const response = await clinicalService.createConsultation(payload)
          setConsultations((current) =>
               current.some((entry) => entry.uuid === response.data.uuid)
                    ? current.map((entry) => (entry.uuid === response.data.uuid ? response.data : entry))
                    : [response.data, ...current]
          )
          return response.data
     }

     const loadClinicalData = async () => {
          setLoading(true)
          try {
               const [consultationsResponse, diagnosesResponse, prescriptionsResponse, labRequestsResponse, labResultsResponse, labTestsResponse] =
                    await Promise.all([
                         clinicalService.listConsultations(),
                         clinicalService.listDiagnoses(),
                         clinicalService.listPrescriptions(),
                         clinicalService.listLabRequests(),
                         clinicalService.listLabResults(),
                         clinicalService.listLabTests(),
                    ])

               setConsultations(consultationsResponse.data)
               setDiagnoses(diagnosesResponse.data)
               setPrescriptions(prescriptionsResponse.data)
               setLabRequests(labRequestsResponse.data)
               setLabResults(labResultsResponse.data)
               setLabTests(labTestsResponse.data)
          } catch (error) {
               console.error(error)
               toast.error("Failed to load clinical workspace.")
          } finally {
               setLoading(false)
          }
     }

     useEffect(() => {
          void loadClinicalData()
     }, [appointment.id])

     const runAction = async (runner: () => Promise<void>, successMessage: string) => {
          setActionState("loading")
          try {
               await runner()
               toast.success(successMessage)
               await loadClinicalData()
          } catch (error) {
               console.error(error)
               if (!(error instanceof Error && error.message === "Consultation note validation failed.")) {
                    toast.error("Something went wrong while saving the clinical record.")
               }
          } finally {
               setActionState("idle")
          }
     }

     const handleCreateConsultation = async () => {
          await runAction(async () => {
               await syncConsultation()
          }, "Consultation ready.")
     }

     const handleStart = async () => {
          await runAction(async () => {
               const consultationRecord = await syncConsultation()
               await clinicalService.startConsultation(consultationRecord.uuid)
          }, "Consultation started.")
     }

     const handleComplete = async () => {
          await runAction(async () => {
               const consultationRecord = await syncConsultation()
               await clinicalService.completeConsultation(consultationRecord.uuid)
          }, "Consultation completed.")
     }

     const handleAddDiagnosis = async () => {
          if (!diagnosisForm.disease_name.trim()) {
               toast.error("Please add a diagnosis name.")
               return
          }

          await runAction(async () => {
               const consultationRecord = await syncConsultation()
               await clinicalService.addDiagnosis(consultationRecord.uuid, {
                    disease_name: diagnosisForm.disease_name.trim(),
                    icd10_code: diagnosisForm.icd10_code.trim(),
                    description: diagnosisForm.description.trim(),
                    type: diagnosisForm.type,
               })
               setDiagnosisForm(emptyDiagnosis)
          }, "Diagnosis added.")
     }

     const handleCreatePrescription = async () => {
          if (!prescriptionItem.medicine_name.trim()) {
               toast.error("Please add a medicine name.")
               return
          }

          await runAction(async () => {
               const consultationRecord = await syncConsultation()
               await clinicalService.createPrescription(consultationRecord.uuid, {
                    notes: prescriptionNotes.trim(),
                    items: [
                         {
                              medicine_name: prescriptionItem.medicine_name.trim(),
                              dosage: prescriptionItem.dosage.trim(),
                              frequency: prescriptionItem.frequency.trim(),
                              duration: prescriptionItem.duration.trim(),
                              instructions: prescriptionItem.instructions.trim(),
                         },
                    ],
               })
               setPrescriptionNotes("")
               setPrescriptionItem(emptyPrescriptionItem)
          }, "Prescription created.")
     }

     const handleCreateLabRequest = async () => {
          if (selectedLabTestUuids.length === 0) {
               toast.error("Please select at least one lab test.")
               return
          }

          await runAction(async () => {
               const consultationRecord = await syncConsultation()
               await clinicalService.createLabRequest(consultationRecord.uuid, {
                    items: selectedLabTestUuids.map((test_type_uuid) => ({ test_type_uuid })),
               })
               setSelectedLabTestUuids([])
               setSelectedLabTestUuid("")
          }, "Lab request created.")
     }

     const handleAddLabTest = () => {
          if (!selectedLabTestUuid) return

          setSelectedLabTestUuids((current) =>
               current.includes(selectedLabTestUuid)
                    ? current
                    : [...current, selectedLabTestUuid]
          )
          setSelectedLabTestUuid("")
     }

     const handleRemoveLabTest = (uuid: string) => {
          setSelectedLabTestUuids((current) => current.filter((item) => item !== uuid))
     }

     return (
          <Card className="rounded-3xl border border-border/60 shadow-lg overflow-hidden">
               <CardHeader className="bg-gradient-to-r from-primary/10 via-transparent to-transparent border-b border-border/50">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                         <div className="space-y-2">
                              <CardTitle className="flex items-center gap-2 text-2xl font-black tracking-tight">
                                                  <HugeiconsIcon icon={MedicalFileIcon} className="h-6 w-6 text-primary" />
                                   Visit Workspace
                              </CardTitle>
                              <CardDescription className="max-w-3xl text-sm">
                                   Use this panel to open the visit, document findings, add diagnoses, issue prescriptions, and request labs without leaving the page.
                              </CardDescription>
                         </div>

                         <div className="flex flex-wrap gap-2">
                              <Badge variant="outline" className="rounded-full px-3 py-1 font-semibold">
                                   <HugeiconsIcon icon={Calendar03Icon} className="mr-2 h-3.5 w-3.5" />
                                   {appointment.illnessCategory}
                              </Badge>
                              <Badge variant="outline" className="rounded-full px-3 py-1 font-semibold">
                                   <HugeiconsIcon icon={Clock03Icon} className="mr-2 h-3.5 w-3.5" />
                                   {appointment.date || "Not scheduled"}
                              </Badge>
                         </div>
                    </div>
               </CardHeader>

               <CardContent className="space-y-8 p-6">
                    {loading ? (
                         <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-8 text-center text-sm text-muted-foreground">
                              Loading consultation data...
                         </div>
                    ) : (
                         <>
                              <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
                                   <div>
                                        <p className="text-xs font-black uppercase tracking-[0.22em] text-muted-foreground">Consultation Status</p>
                                        <p className="mt-2 text-lg font-bold">
                                             {consultation ? `Visit ${consultation.status.replace("_", " ")}` : "No visit created yet"}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                             {consultation
                                                  ? `Opened at ${new Date(consultation.started_at).toLocaleString()}`
                                                  : "Open the visit before adding diagnoses, prescriptions, or lab requests."}
                                        </p>
                                   </div>

                                   <div className="flex flex-wrap gap-3">
                                        <Badge
                                             variant="outline"
                                             className={
                                                  consultationDraftStatus === "saved"
                                                       ? "rounded-full border-emerald-200 bg-emerald-50 px-3 py-1 font-bold text-emerald-700"
                                                       : consultationDraftStatus === "unsaved"
                                                            ? "rounded-full border-amber-200 bg-amber-50 px-3 py-1 font-bold text-amber-700"
                                                            : "rounded-full border-border/70 bg-muted/40 px-3 py-1 font-bold text-muted-foreground"
                                             }
                                        >
                                             {consultationDraftStatus === "saved"
                                                  ? "Visit note saved"
                                                  : consultationDraftStatus === "unsaved"
                                                       ? "Unsaved visit note"
                                                       : "No visit note yet"}
                                        </Badge>
                                        {lastSavedLabel && (
                                             <p className="self-center text-xs font-medium text-muted-foreground">
                                                  {lastSavedLabel}
                                             </p>
                                        )}
                                        {!consultation ? (
                                                  <Button onClick={handleCreateConsultation} disabled={actionState === "loading"} className="rounded-2xl">
                                                  <HugeiconsIcon icon={PlusSignIcon} className="mr-2 h-4 w-4" />
                                                  Open Visit
                                              </Button>
                                        ) : (
                                             <>
                                                  <Button variant="outline" onClick={handleStart} disabled={actionState === "loading"} className="rounded-2xl">
                                                       <HugeiconsIcon icon={RefreshIcon} className="mr-2 h-4 w-4" />
                                                       Refresh Visit
                                                  </Button>
                                                  {isVisitOpen && (
                                                       <Button onClick={handleComplete} disabled={actionState === "loading"} className="rounded-2xl bg-emerald-600 hover:bg-emerald-700">
                                                            <HugeiconsIcon icon={CheckCircle} className="mr-2 h-4 w-4" />
                                                            Close Visit
                                                       </Button>
                                                  )}
                                             </>
                                        )}
                                   </div>
                              </div>

                              <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
                                   <div className="flex items-center gap-2">
                                        <HugeiconsIcon icon={MedicalFileIcon} className="h-5 w-5 text-primary" />
                                   <h3 className="text-base font-bold">Visit Note</h3>
                                   </div>
                                   <p className="mt-1 text-sm text-muted-foreground">
                                        Save the core visit note independently, then use the other actions to add diagnoses, prescriptions, and lab requests.
                                   </p>
                                             <div className="mt-4 grid gap-4 xl:grid-cols-2">
                                        <div className="space-y-4">
                                             <Textarea
                                                  value={consultationForm.chief_complaint}
                                                  onChange={(e) =>
                                                       {
                                                            setConsultationForm((state) => ({
                                                                 ...state,
                                                                 chief_complaint: e.target.value,
                                                            }))
                                                            if (consultationErrors.chief_complaint) {
                                                                 setConsultationErrors((state) => ({ ...state, chief_complaint: undefined }))
                                                            }
                                                       }
                                                  }
                                                  placeholder="Chief complaint"
                                                  className="min-h-24 rounded-2xl"
                                             />
                                             {consultationErrors.chief_complaint && (
                                                  <p className="text-xs font-medium text-rose-600">{consultationErrors.chief_complaint}</p>
                                             )}
                                             <Textarea
                                                  value={consultationForm.history_of_present_illness}
                                                  onChange={(e) =>
                                                       setConsultationForm((state) => ({
                                                            ...state,
                                                            history_of_present_illness: e.target.value,
                                                       }))
                                                  }
                                                  placeholder="History of present illness"
                                                  className="min-h-32 rounded-2xl"
                                             />
                                        </div>
                                        <div className="space-y-4">
                                             <Textarea
                                                  value={consultationForm.physical_examination}
                                                  onChange={(e) =>
                                                       setConsultationForm((state) => ({
                                                            ...state,
                                                            physical_examination: e.target.value,
                                                       }))
                                                  }
                                                  placeholder="Physical examination"
                                                  className="min-h-32 rounded-2xl"
                                             />
                                             <Textarea
                                                  value={consultationForm.provisional_diagnosis}
                                                  onChange={(e) =>
                                                       setConsultationForm((state) => ({
                                                            ...state,
                                                            provisional_diagnosis: e.target.value,
                                                       }))
                                                  }
                                                  placeholder="Provisional diagnosis"
                                                  className="min-h-24 rounded-2xl"
                                             />
                                        </div>
                                   </div>
                                   <div className="mt-4 flex flex-wrap items-center gap-3">
                                             <Button onClick={handleCreateConsultation} disabled={actionState === "loading"} className="rounded-2xl">
                                             Save Visit Note
                                        </Button>
                                        <p className="text-xs text-muted-foreground">
                                             This will open the visit if needed, or update the existing note.
                                        </p>
                                   </div>
                              </div>

                              <div className="grid gap-6 xl:grid-cols-2">
                                   <div className="space-y-6">
                                        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
                                             <div className="flex items-center gap-2">
                                                  <HugeiconsIcon icon={StethoscopeIcon} className="h-5 w-5 text-primary" />
                                                  <h3 className="text-base font-bold">Record Diagnosis</h3>
                                             </div>
                                             <div className="mt-4 grid gap-3">
                                                  <Input
                                                       value={diagnosisForm.disease_name}
                                                       onChange={(e) => setDiagnosisForm((state) => ({ ...state, disease_name: e.target.value }))}
                                                       placeholder="Disease name"
                                                  />
                                                  <Input
                                                       value={diagnosisForm.icd10_code}
                                                       onChange={(e) => setDiagnosisForm((state) => ({ ...state, icd10_code: e.target.value }))}
                                                       placeholder="ICD-10 code"
                                                  />
                                                  <Textarea
                                                       value={diagnosisForm.description}
                                                       onChange={(e) => setDiagnosisForm((state) => ({ ...state, description: e.target.value }))}
                                                       placeholder="Diagnosis notes"
                                                  />
                                                  <div className="flex flex-wrap gap-2">
                                                       {(["provisional", "final"] as const).map((value) => (
                                                            <Button
                                                                 key={value}
                                                                 type="button"
                                                                 variant={diagnosisForm.type === value ? "default" : "outline"}
                                                                 className="rounded-full"
                                                                 onClick={() => setDiagnosisForm((state) => ({ ...state, type: value }))}
                                                            >
                                                                 {value}
                                                            </Button>
                                                       ))}
                                                  </div>
                                                  <Button onClick={handleAddDiagnosis} disabled={actionState === "loading"} className="rounded-2xl">
                                                       Record Diagnosis
                                                  </Button>
                                             </div>
                                        </div>

                                        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
                                             <div className="flex items-center gap-2">
                                                  <HugeiconsIcon icon={FileEditIcon} className="h-5 w-5 text-primary" />
                                                  <h3 className="text-base font-bold">Write Prescription</h3>
                                             </div>
                                             <div className="mt-4 grid gap-3">
                                                  <Textarea
                                                       value={prescriptionNotes}
                                                       onChange={(e) => setPrescriptionNotes(e.target.value)}
                                                       placeholder="Prescription notes"
                                                  />
                                                  <Input
                                                       value={prescriptionItem.medicine_name}
                                                       onChange={(e) => setPrescriptionItem((state) => ({ ...state, medicine_name: e.target.value }))}
                                                       placeholder="Medicine name"
                                                  />
                                                  <div className="grid gap-3 md:grid-cols-2">
                                                       <Input
                                                            value={prescriptionItem.dosage}
                                                            onChange={(e) => setPrescriptionItem((state) => ({ ...state, dosage: e.target.value }))}
                                                            placeholder="Dosage"
                                                       />
                                                       <Input
                                                            value={prescriptionItem.frequency}
                                                            onChange={(e) => setPrescriptionItem((state) => ({ ...state, frequency: e.target.value }))}
                                                            placeholder="Frequency"
                                                       />
                                                  </div>
                                                  <div className="grid gap-3 md:grid-cols-2">
                                                       <Input
                                                            value={prescriptionItem.duration}
                                                            onChange={(e) => setPrescriptionItem((state) => ({ ...state, duration: e.target.value }))}
                                                            placeholder="Duration"
                                                       />
                                                       <Input
                                                            value={prescriptionItem.instructions}
                                                            onChange={(e) => setPrescriptionItem((state) => ({ ...state, instructions: e.target.value }))}
                                                            placeholder="Instructions"
                                                       />
                                                  </div>
                                                  <Button onClick={handleCreatePrescription} disabled={actionState === "loading"} className="rounded-2xl">
                                                       Write Prescription
                                                  </Button>
                                             </div>
                                        </div>
                                   </div>

                                   <div className="space-y-6">
                                       <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
                                             <div className="flex items-center gap-2">
                                                  <HugeiconsIcon icon={Clock03Icon} className="h-5 w-5 text-primary" />
                                                  <h3 className="text-base font-bold">Request Lab Tests</h3>
                                             </div>
                                             <div className="mt-4 space-y-4">
                                                  <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                                                       <select
                                                            className="h-10 rounded-2xl border border-input bg-background px-3 text-sm outline-none"
                                                            value={selectedLabTestUuid}
                                                            onChange={(e) => setSelectedLabTestUuid(e.target.value)}
                                                       >
                                                            <option value="">Select a test</option>
                                                            {labTests.map((test) => (
                                                                 <option key={test.uuid} value={test.uuid}>
                                                                      {test.name}
                                                                 </option>
                                                            ))}
                                                       </select>
                                                       <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={handleAddLabTest}
                                                            disabled={!selectedLabTestUuid}
                                                            className="rounded-2xl"
                                                       >
                                                       Add to request
                                                       </Button>
                                                  </div>

                                                  <div className="flex flex-wrap gap-2">
                                                       {selectedLabTestUuids.length === 0 ? (
                                                            <p className="text-sm text-muted-foreground">No tests selected yet.</p>
                                                       ) : (
                                                            selectedLabTestUuids.map((uuid) => {
                                                                 const test = labTests.find((entry) => entry.uuid === uuid)
                                                                 return (
                                                                      <button
                                                                           key={uuid}
                                                                           type="button"
                                                                           onClick={() => handleRemoveLabTest(uuid)}
                                                                           className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary transition hover:bg-primary/10"
                                                                      >
                                                                           {test?.name || "Selected test"}
                                                                           <span className="text-primary/60">×</span>
                                                                      </button>
                                                                 )
                                                            })
                                                       )}
                                                  </div>

                                                  <Button onClick={handleCreateLabRequest} disabled={actionState === "loading" || selectedLabTestUuids.length === 0} className="rounded-2xl">
                                                       Send Lab Request
                                                  </Button>
                                             </div>
                                        </div>
                                   </div>
                              </div>

                              <div className="grid gap-6 xl:grid-cols-2">
                                   <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
                                        <h3 className="text-base font-bold">Diagnosis Log</h3>
                                        <div className="mt-4 space-y-3">
                                             {consultationDiagnoses.length ? consultationDiagnoses.map((diagnosis) => (
                                                  <div key={diagnosis.uuid} className="rounded-2xl border border-border/60 p-3">
                                                       <p className="font-semibold">{diagnosis.disease_name}</p>
                                                       <p className="text-xs text-muted-foreground">{diagnosis.type} {diagnosis.icd10_code ? `• ${diagnosis.icd10_code}` : ""}</p>
                                                  </div>
                                             )) : (
                                                  <p className="text-sm text-muted-foreground">No diagnoses recorded for this consultation yet.</p>
                                             )}
                                        </div>
                                   </div>

                                   <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
                                        <h3 className="text-base font-bold">Orders & Workflow</h3>
                                        <div className="mt-4 space-y-5">
                                             <div>
                                                  <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Prescriptions</p>
                                                  <p className="text-sm text-muted-foreground">{consultationPrescriptions.length} prescription(s)</p>
                                             </div>
                                             <div>
                                                  <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Lab Requests</p>
                                                  <p className="text-sm text-muted-foreground">{consultationLabRequests.length} request(s)</p>
                                             </div>

                                             <div className="space-y-3 border-t border-border/60 pt-4">
                                                  <div>
                                                       <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Lab Replies</p>
                                                       <p className="text-sm text-muted-foreground">
                                                            Grouped by appointment, with each requested test and its answer below.
                                                       </p>
                                                  </div>

                                                  {consultationLabRequestsWithResults.length === 0 ? (
                                                       <div className="rounded-2xl border border-dashed border-border/60 bg-muted/20 p-4">
                                                            <p className="text-sm text-muted-foreground">No lab requests have been created for this appointment yet.</p>
                                                       </div>
                                                  ) : (
                                                       <div className="space-y-3">
                                                            {consultationLabRequestsWithResults.map((request) => (
                                                                 <div key={request.uuid} className="rounded-2xl border border-border/60 bg-muted/10 p-4">
                                                                      <div className="flex flex-wrap items-center justify-between gap-3">
                                                                           <div>
                                                                                <p className="text-sm font-bold text-foreground">
                                                                                     Appointment {request.appointment_uuid.slice(0, 8)}
                                                                                </p>
                                                                                <p className="text-xs text-muted-foreground">
                                                                                     Request {request.uuid.slice(0, 8)} • {request.items.length} test(s)
                                                                                </p>
                                                                           </div>
                                                                           <Badge variant="outline" className="rounded-full">
                                                                                {request.status.replace("_", " ")}
                                                                           </Badge>
                                                                      </div>

                                                                      <div className="mt-4 space-y-3">
                                                                           {request.items.map((item) => {
                                                                                const reply = item.result
                                                                                return (
                                                                                     <div key={item.uuid} className="rounded-2xl border border-border/60 bg-card p-3">
                                                                                          <div className="flex flex-wrap items-center justify-between gap-2">
                                                                                               <p className="font-semibold">{item.testTypeName}</p>
                                                                                               {reply ? (
                                                                                                    <Badge className="rounded-full bg-emerald-500 text-white">Answered</Badge>
                                                                                               ) : (
                                                                                                    <Badge variant="outline" className="rounded-full">Waiting</Badge>
                                                                                               )}
                                                                                          </div>
                                                                                          {reply ? (
                                                                                               <div className="mt-3 grid gap-2">
                                                                                                    <div className="rounded-xl bg-muted/20 p-3">
                                                                                                         <p className="text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">Result</p>
                                                                                                         <p className="mt-1 font-semibold">{reply.result}</p>
                                                                                                    </div>
                                                                                                    <div className="rounded-xl bg-muted/20 p-3">
                                                                                                         <p className="text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">Lab Remarks</p>
                                                                                                         <p className="mt-1 text-sm text-muted-foreground">{reply.remarks || "No remarks added."}</p>
                                                                                                    </div>
                                                                                                    <p className="text-[11px] text-muted-foreground">
                                                                                                         Verified by {reply.verified_by_name} on {formatVerificationTime(reply.verified_at)}
                                                                                                    </p>
                                                                                               </div>
                                                                                          ) : (
                                                                                               <p className="mt-3 text-sm text-muted-foreground">No reply has been recorded for this test yet.</p>
                                                                                          )}
                                                                                     </div>
                                                                                )
                                                                           })}
                                                                      </div>
                                                                 </div>
                                                            ))}
                                                       </div>
                                                  )}
                                             </div>
                                        </div>
                                   </div>
                              </div>
                         </>
                    )}
               </CardContent>
          </Card>
     )
}
