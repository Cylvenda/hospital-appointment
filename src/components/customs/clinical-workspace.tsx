"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckCircle,
  Clock03Icon,
  PlusSignIcon,
  RefreshIcon,
  StethoscopeIcon,
  Calendar03Icon,
  FileEditIcon,
  MedicalFileIcon,
} from "@hugeicons/core-free-icons";
import type { Appointment } from "@/store/appointments/appointment.types";
import {
  clinicalService,
  type ConsultationApi,
  type DiagnosisApi,
  type LabRequestApi,
  type LabTestApi,
  type PrescriptionApi,
} from "@/api/services/clinical.service";
import { getAppointmentQueueForRole } from "@/lib/appointment-queues";
import { useTranslation } from "@/lib/i18n";

type Props = {
  appointment: Appointment;
};

type ActionState = "idle" | "loading";

type DiagnosisForm = {
  disease_name: string;
  icd10_code: string;
  description: string;
  type: "provisional" | "final";
};

type ConsultationForm = {
  chief_complaint: string;
  history_of_present_illness: string;
  physical_examination: string;
  provisional_diagnosis: string;
};

type ConsultationFormErrors = Partial<Record<keyof ConsultationForm, string>>;

type LabResultSummary = {
  uuid: string;
  request_item_uuid: string;
  test_name: string;
  result: string;
  remarks: string;
  verified_by_uuid: string;
  verified_by_name: string;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
};

const emptyDiagnosis: DiagnosisForm = {
  disease_name: "",
  icd10_code: "",
  description: "",
  type: "provisional",
};

const emptyConsultationForm: ConsultationForm = {
  chief_complaint: "",
  history_of_present_illness: "",
  physical_examination: "",
  provisional_diagnosis: "",
};

const emptyPrescriptionItem = {
  medicine_name: "",
  dosage: "",
  frequency: "",
  duration: "",
  instructions: "",
};

type PrescriptionItemDraft = typeof emptyPrescriptionItem;

export function ClinicalWorkspace({ appointment }: Props) {
  const { t, language } = useTranslation();
  const locale = language === "sw" ? "sw-TZ" : "en-US";
  const [consultations, setConsultations] = useState<ConsultationApi[]>([]);
  const [diagnoses, setDiagnoses] = useState<DiagnosisApi[]>([]);
  const [prescriptions, setPrescriptions] = useState<PrescriptionApi[]>([]);
  const [labRequests, setLabRequests] = useState<LabRequestApi[]>([]);
  const [labResults, setLabResults] = useState<LabResultSummary[]>([]);
  const [labTests, setLabTests] = useState<LabTestApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionState, setActionState] = useState<ActionState>("idle");

  const [diagnosisForm, setDiagnosisForm] =
    useState<DiagnosisForm>(emptyDiagnosis);
  const [consultationForm, setConsultationForm] = useState<ConsultationForm>(
    emptyConsultationForm,
  );
  const [consultationErrors, setConsultationErrors] =
    useState<ConsultationFormErrors>({});
  const [prescriptionNotes, setPrescriptionNotes] = useState("");
  const [prescriptionItem, setPrescriptionItem] = useState(
    emptyPrescriptionItem,
  );
  const [prescriptionItems, setPrescriptionItems] = useState<
    PrescriptionItemDraft[]
  >([]);
  const [selectedLabTestUuids, setSelectedLabTestUuids] = useState<string[]>(
    [],
  );
  const [selectedLabTestUuid, setSelectedLabTestUuid] = useState("");
  const consultation = useMemo(
    () =>
      consultations.find(
        (entry) => entry.appointment_uuid === appointment.id,
      ) ?? null,
    [appointment.id, consultations],
  );
  const isVisitOpen =
    getAppointmentQueueForRole(appointment, "doctor") === "in-consultation";

  const formatVerificationTime = (value: string | null) => {
    if (!value) {
      return t("i18nAudit.clinicalWorkspace.pendingVerification");
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return t("i18nAudit.clinicalWorkspace.pendingVerification");
    }

    return parsed.toLocaleString(locale);
  };

  useEffect(() => {
    if (!consultation) {
      setConsultationForm(emptyConsultationForm);
      return;
    }

    setConsultationForm({
      chief_complaint: consultation.chief_complaint || "",
      history_of_present_illness: consultation.history_of_present_illness || "",
      physical_examination: consultation.physical_examination || "",
      provisional_diagnosis: consultation.provisional_diagnosis || "",
    });
  }, [consultation]);

  const consultationDiagnoses = useMemo(
    () =>
      diagnoses.filter(
        (diagnosis) =>
          diagnosis.consultation_appointment_uuid === appointment.id,
      ),
    [appointment.id, diagnoses],
  );

  const consultationPrescriptions = useMemo(
    () =>
      prescriptions.filter(
        (prescription) => prescription.consultation_uuid === consultation?.uuid,
      ),
    [consultation?.uuid, prescriptions],
  );

  const consultationLabRequests = useMemo(
    () =>
      labRequests.filter(
        (request) => request.consultation_uuid === consultation?.uuid,
      ),
    [consultation?.uuid, labRequests],
  );

  const labResultsByItemId = useMemo(() => {
    return labResults.reduce<Record<string, LabResultSummary>>(
      (acc, result) => {
        acc[result.request_item_uuid] = result;
        return acc;
      },
      {},
    );
  }, [labResults]);

  const consultationLabRequestsWithResults = useMemo(() => {
    return consultationLabRequests.map((request) => ({
      ...request,
      items: request.items.map((item) => ({
        ...item,
        result: labResultsByItemId[item.uuid] ?? null,
      })),
    }));
  }, [consultationLabRequests, labResultsByItemId]);

  const consultationBaseline = useMemo(
    () => ({
      chief_complaint: consultation?.chief_complaint || "",
      history_of_present_illness:
        consultation?.history_of_present_illness || "",
      physical_examination: consultation?.physical_examination || "",
      provisional_diagnosis: consultation?.provisional_diagnosis || "",
    }),
    [consultation],
  );

  const consultationHasChanges = useMemo(() => {
    return (
      consultationForm.chief_complaint.trim() !==
        consultationBaseline.chief_complaint.trim() ||
      consultationForm.history_of_present_illness.trim() !==
        consultationBaseline.history_of_present_illness.trim() ||
      consultationForm.physical_examination.trim() !==
        consultationBaseline.physical_examination.trim() ||
      consultationForm.provisional_diagnosis.trim() !==
        consultationBaseline.provisional_diagnosis.trim()
    );
  }, [consultationBaseline, consultationForm]);

  const consultationDraftStatus = consultation
    ? consultationHasChanges
      ? "unsaved"
      : "saved"
    : "empty";
  const lastSavedLabel = useMemo(() => {
    if (!consultation) return null;

    const savedAt = new Date(consultation.updated_at);
    const elapsedMs = Date.now() - savedAt.getTime();
    if (Number.isFinite(elapsedMs) && elapsedMs < 60_000) {
      return t("i18nAudit.clinicalWorkspace.updatedNow");
    }

    return t("i18nAudit.clinicalWorkspace.savedAt", { time: savedAt.toLocaleTimeString(locale, {
      hour: "numeric",
      minute: "2-digit",
    }) });
  }, [consultation, locale, t]);

  const syncConsultation = async () => {
    setConsultationErrors({});
    const payload = {
      appointment_uuid: appointment.id,
      doctor_uuid: appointment.doctorId ?? undefined,
      chief_complaint:
        consultationForm.chief_complaint.trim() ||
        appointment.note ||
        appointment.illnessCategory,
      history_of_present_illness:
        consultationForm.history_of_present_illness.trim(),
      physical_examination: consultationForm.physical_examination.trim(),
      provisional_diagnosis: consultationForm.provisional_diagnosis.trim(),
    };

    if (consultation) {
      const response = await clinicalService.updateConsultation(
        consultation.uuid,
        payload,
      );
      setConsultations((current) =>
        current.map((entry) =>
          entry.uuid === response.data.uuid ? response.data : entry,
        ),
      );
      return response.data;
    }

    const response = await clinicalService.createConsultation(payload);
    setConsultations((current) =>
      current.some((entry) => entry.uuid === response.data.uuid)
        ? current.map((entry) =>
            entry.uuid === response.data.uuid ? response.data : entry,
          )
        : [response.data, ...current],
    );
    return response.data;
  };

  const loadClinicalData = useCallback(async () => {
    setLoading(true);
    try {
      const [
        consultationsResponse,
        diagnosesResponse,
        prescriptionsResponse,
        labRequestsResponse,
        labResultsResponse,
        labTestsResponse,
      ] = await Promise.all([
        clinicalService.listConsultations(),
        clinicalService.listDiagnoses(),
        clinicalService.listPrescriptions(),
        clinicalService.listLabRequests(),
        clinicalService.listLabResults(),
        clinicalService.listLabTests(),
      ]);

      setConsultations(consultationsResponse.data);
      setDiagnoses(diagnosesResponse.data);
      setPrescriptions(prescriptionsResponse.data);
      setLabRequests(labRequestsResponse.data);
      setLabResults(labResultsResponse.data);
      setLabTests(labTestsResponse.data);
    } catch (error) {
      console.error(error);
      toast.error(t("i18nAudit.clinicalWorkspace.loadFailed"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void loadClinicalData();
  }, [loadClinicalData]);

  const runAction = async (
    runner: () => Promise<void>,
    successMessage: string,
  ) => {
    setActionState("loading");
    try {
      await runner();
      toast.success(successMessage);
      await loadClinicalData();
    } catch (error) {
      console.error(error);
      if (
        !(
          error instanceof Error &&
          error.message === "Consultation note validation failed."
        )
      ) {
        toast.error(t("i18nAudit.clinicalWorkspace.saveFailed"));
      }
    } finally {
      setActionState("idle");
    }
  };

  const handleCreateConsultation = async () => {
    await runAction(async () => {
      await syncConsultation();
    }, "Consultation ready.");
  };

  const handleStart = async () => {
    await runAction(async () => {
      const consultationRecord = await syncConsultation();
      await clinicalService.startConsultation(consultationRecord.uuid);
    }, "Consultation started.");
  };

  const handleComplete = async () => {
    await runAction(async () => {
      const consultationRecord = await syncConsultation();
      await clinicalService.completeConsultation(consultationRecord.uuid);
    }, "Consultation completed.");
  };

  const handleAddDiagnosis = async () => {
    if (!diagnosisForm.disease_name.trim()) {
      toast.error(t("i18nAudit.clinicalWorkspace.diagnosisRequired"));
      return;
    }

    await runAction(async () => {
      const consultationRecord = await syncConsultation();
      await clinicalService.addDiagnosis(consultationRecord.uuid, {
        disease_name: diagnosisForm.disease_name.trim(),
        icd10_code: diagnosisForm.icd10_code.trim(),
        description: diagnosisForm.description.trim(),
        type: diagnosisForm.type,
      });
      setDiagnosisForm(emptyDiagnosis);
    }, "Diagnosis added.");
  };

  const handleCreatePrescription = async () => {
    if (prescriptionItems.length === 0) {
      toast.error(t("i18nAudit.clinicalWorkspace.medicineRequired"));
      return;
    }

    await runAction(async () => {
      const consultationRecord = await syncConsultation();
      await clinicalService.createPrescription(consultationRecord.uuid, {
        notes: prescriptionNotes.trim(),
        items: prescriptionItems.map((item) => ({
          medicine_name: item.medicine_name.trim(),
          dosage: item.dosage.trim(),
          frequency: item.frequency.trim(),
          duration: item.duration.trim(),
          instructions: item.instructions.trim(),
        })),
      });
      setPrescriptionNotes("");
      setPrescriptionItem(emptyPrescriptionItem);
      setPrescriptionItems([]);
    }, "Prescription created.");
  };

  const handleAddPrescriptionItem = () => {
    if (!prescriptionItem.medicine_name.trim()) {
      toast.error(t("i18nAudit.clinicalWorkspace.medicineNameRequired"));
      return;
    }
    if (
      !prescriptionItem.dosage.trim() ||
      !prescriptionItem.frequency.trim() ||
      !prescriptionItem.duration.trim()
    ) {
      toast.error(t("i18nAudit.clinicalWorkspace.medicineDetailsRequired"));
      return;
    }

    setPrescriptionItems((current) => [...current, { ...prescriptionItem }]);
    setPrescriptionItem(emptyPrescriptionItem);
  };

  const handleRemovePrescriptionItem = (index: number) => {
    setPrescriptionItems((current) =>
      current.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  const handleExportRecord = async (format: "pdf" | "docx") => {
    if (!consultation) {
      toast.error(t("i18nAudit.clinicalWorkspace.saveBeforeExport"));
      return;
    }

    setActionState("loading");
    try {
      const blob = await clinicalService.exportConsultationRecord(
        consultation.uuid,
        format,
      );
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `clinical_record_${appointment.appointmentId || appointment.id}.${format}`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      toast.success(t("i18nAudit.clinicalWorkspace.exported", { format: format.toUpperCase() }));
    } catch (error) {
      console.error(error);
      toast.error(t("i18nAudit.clinicalWorkspace.exportFailed"));
    } finally {
      setActionState("idle");
    }
  };

  const handleCreateLabRequest = async () => {
    if (selectedLabTestUuids.length === 0) {
      toast.error(t("i18nAudit.clinicalWorkspace.labTestRequired"));
      return;
    }

    await runAction(async () => {
      const consultationRecord = await syncConsultation();
      await clinicalService.createLabRequest(consultationRecord.uuid, {
        items: selectedLabTestUuids.map((test_type_uuid) => ({
          test_type_uuid,
        })),
      });
      setSelectedLabTestUuids([]);
      setSelectedLabTestUuid("");
    }, "Lab request created.");
  };

  const handleAddLabTest = () => {
    if (!selectedLabTestUuid) return;

    setSelectedLabTestUuids((current) =>
      current.includes(selectedLabTestUuid)
        ? current
        : [...current, selectedLabTestUuid],
    );
    setSelectedLabTestUuid("");
  };

  const handleRemoveLabTest = (uuid: string) => {
    setSelectedLabTestUuids((current) =>
      current.filter((item) => item !== uuid),
    );
  };

  return (
    <Card className="rounded-3xl border border-border/60 shadow-lg overflow-hidden">
      <CardHeader className="bg-linear-to-r from-primary/10 via-transparent to-transparent border-b border-border/50">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <CardTitle className="flex items-center gap-2 text-2xl font-black tracking-tight">
              <HugeiconsIcon
                icon={MedicalFileIcon}
                className="h-6 w-6 text-primary"
              />
              {t("i18nAudit.clinicalWorkspace.workspaceTitle")}
            </CardTitle>
            <CardDescription className="max-w-3xl text-sm">
              {t("i18nAudit.clinicalWorkspace.workspaceDescription")}
            </CardDescription>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className="rounded-full px-3 py-1 font-semibold"
            >
              <HugeiconsIcon
                icon={Calendar03Icon}
                className="mr-2 h-3.5 w-3.5"
              />
              {appointment.illnessCategory}
            </Badge>
            <Badge
              variant="outline"
              className="rounded-full px-3 py-1 font-semibold"
            >
              <HugeiconsIcon icon={Clock03Icon} className="mr-2 h-3.5 w-3.5" />
              {appointment.date || t("i18nAudit.clinicalWorkspace.notScheduled")}
            </Badge>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!consultation || actionState === "loading"}
              onClick={() => void handleExportRecord("pdf")}
              className="rounded-full"
            >
              {t("i18nAudit.clinicalWorkspace.pdfRecord")}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!consultation || actionState === "loading"}
              onClick={() => void handleExportRecord("docx")}
              className="rounded-full"
            >
              {t("i18nAudit.clinicalWorkspace.docxRecord")}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-8 p-6">
        {loading ? (
          <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-8 text-center text-sm text-muted-foreground">
            {t("i18nAudit.clinicalWorkspace.loadingConsultation")}
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-muted-foreground">
                  {t("i18nAudit.clinicalWorkspace.consultationStatus")}
                </p>
                <p className="mt-2 text-lg font-bold">
                  {consultation
                    ? t("i18nAudit.clinicalWorkspace.visitStatus", { status: consultation.status.replace("_", " ") })
                    : t("i18nAudit.clinicalWorkspace.noVisit")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {consultation
                    ? t("i18nAudit.clinicalWorkspace.openedAt", { date: new Date(consultation.started_at).toLocaleString(locale) })
                    : t("i18nAudit.clinicalWorkspace.openVisitHelp")}
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
                    ? t("i18nAudit.clinicalWorkspace.visitNoteSaved")
                    : consultationDraftStatus === "unsaved"
                      ? t("i18nAudit.clinicalWorkspace.visitNoteUnsaved")
                      : t("i18nAudit.clinicalWorkspace.noVisitNote")}
                </Badge>
                {lastSavedLabel && (
                  <p className="self-center text-xs font-medium text-muted-foreground">
                    {lastSavedLabel}
                  </p>
                )}
                {!consultation ? (
                  <Button
                    onClick={handleCreateConsultation}
                    disabled={actionState === "loading"}
                    className="rounded-2xl"
                  >
                    <HugeiconsIcon
                      icon={PlusSignIcon}
                      className="mr-2 h-4 w-4"
                    />
                    {t("i18nAudit.clinicalWorkspace.openVisit")}
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleStart}
                      disabled={actionState === "loading"}
                      className="rounded-2xl"
                    >
                      <HugeiconsIcon
                        icon={RefreshIcon}
                        className="mr-2 h-4 w-4"
                      />
                      {t("i18nAudit.clinicalWorkspace.refreshVisit")}
                    </Button>
                    {isVisitOpen && (
                      <Button
                        onClick={handleComplete}
                        disabled={actionState === "loading"}
                        className="rounded-2xl bg-emerald-600 hover:bg-emerald-700"
                      >
                        <HugeiconsIcon
                          icon={CheckCircle}
                          className="mr-2 h-4 w-4"
                        />
                        {t("i18nAudit.clinicalWorkspace.closeVisit")}
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={MedicalFileIcon}
                  className="h-5 w-5 text-primary"
                />
                <h3 className="text-base font-bold">{t("i18nAudit.clinicalWorkspace.visitNote")}</h3>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("i18nAudit.clinicalWorkspace.noteHelp")}
              </p>
              <div className="mt-4 grid gap-4 xl:grid-cols-2">
                <div className="space-y-4">
                  <Textarea
                    value={consultationForm.chief_complaint}
                    onChange={(e) => {
                      setConsultationForm((state) => ({
                        ...state,
                        chief_complaint: e.target.value,
                      }));
                      if (consultationErrors.chief_complaint) {
                        setConsultationErrors((state) => ({
                          ...state,
                          chief_complaint: undefined,
                        }));
                      }
                    }}
                    placeholder={t("i18nAudit.clinicalWorkspace.chiefComplaint")}
                    className="min-h-24 rounded-2xl"
                  />
                  {consultationErrors.chief_complaint && (
                    <p className="text-xs font-medium text-rose-600">
                      {consultationErrors.chief_complaint}
                    </p>
                  )}
                  <Textarea
                    value={consultationForm.history_of_present_illness}
                    onChange={(e) =>
                      setConsultationForm((state) => ({
                        ...state,
                        history_of_present_illness: e.target.value,
                      }))
                    }
                    placeholder={t("i18nAudit.clinicalWorkspace.presentIllness")}
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
                    placeholder={t("i18nAudit.clinicalWorkspace.physicalExamination")}
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
                    placeholder={t("i18nAudit.clinicalWorkspace.provisionalDiagnosis")}
                    className="min-h-24 rounded-2xl"
                  />
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button
                  onClick={handleCreateConsultation}
                  disabled={actionState === "loading"}
                  className="rounded-2xl"
                >
                  {t("i18nAudit.clinicalWorkspace.saveVisitNote")}
                </Button>
                <p className="text-xs text-muted-foreground">
                  {t("i18nAudit.clinicalWorkspace.saveVisitHelp")}
                </p>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <div className="space-y-6">
                <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
                  <div className="flex items-center gap-2">
                    <HugeiconsIcon
                      icon={StethoscopeIcon}
                      className="h-5 w-5 text-primary"
                    />
                    <h3 className="text-base font-bold">{t("i18nAudit.clinicalWorkspace.recordDiagnosis")}</h3>
                  </div>
                  <div className="mt-4 grid gap-3">
                    <Input
                      value={diagnosisForm.disease_name}
                      onChange={(e) =>
                        setDiagnosisForm((state) => ({
                          ...state,
                          disease_name: e.target.value,
                        }))
                      }
                      placeholder={t("i18nAudit.clinicalWorkspace.diseaseName")}
                    />
                    <Input
                      value={diagnosisForm.icd10_code}
                      onChange={(e) =>
                        setDiagnosisForm((state) => ({
                          ...state,
                          icd10_code: e.target.value,
                        }))
                      }
                      placeholder={t("i18nAudit.clinicalWorkspace.icdCode")}
                    />
                    <Textarea
                      value={diagnosisForm.description}
                      onChange={(e) =>
                        setDiagnosisForm((state) => ({
                          ...state,
                          description: e.target.value,
                        }))
                      }
                      placeholder={t("i18nAudit.clinicalWorkspace.diagnosisNotes")}
                    />
                    <div className="flex flex-wrap gap-2">
                      {(["provisional", "final"] as const).map((value) => (
                        <Button
                          key={value}
                          type="button"
                          variant={
                            diagnosisForm.type === value ? "default" : "outline"
                          }
                          className="rounded-full"
                          onClick={() =>
                            setDiagnosisForm((state) => ({
                              ...state,
                              type: value,
                            }))
                          }
                        >
                          {value}
                        </Button>
                      ))}
                    </div>
                    <Button
                      onClick={handleAddDiagnosis}
                      disabled={actionState === "loading"}
                      className="rounded-2xl"
                    >
                      {t("i18nAudit.clinicalWorkspace.recordDiagnosis")}
                    </Button>
                  </div>
                </div>

                <div className="overflow-hidden rounded-3xl border border-primary/15 bg-linear-to-br from-primary/6 via-card to-card shadow-sm">
                  <div className="border-b border-border/60 bg-card/70 p-5">
                    <div className="flex items-center gap-2">
                      <HugeiconsIcon
                        icon={FileEditIcon}
                        className="h-5 w-5 text-primary"
                      />
                      <div>
                        <h3 className="text-base font-bold">
                          {t("i18nAudit.clinicalWorkspace.medicationOrder")}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {t("i18nAudit.clinicalWorkspace.medicationOrderHelp")}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-4 p-5">
                    <Textarea
                      value={prescriptionNotes}
                      onChange={(e) => setPrescriptionNotes(e.target.value)}
                      placeholder={t("i18nAudit.clinicalWorkspace.prescriptionNotes")}
                      className="min-h-20 rounded-2xl bg-background"
                    />
                    <Input
                      value={prescriptionItem.medicine_name}
                      onChange={(e) =>
                        setPrescriptionItem((state) => ({
                          ...state,
                          medicine_name: e.target.value,
                        }))
                      }
                      placeholder={t("i18nAudit.clinicalWorkspace.medicineName")}
                      className="rounded-xl bg-background"
                    />
                    <div className="grid gap-3 md:grid-cols-2">
                      <Input
                        value={prescriptionItem.dosage}
                        onChange={(e) =>
                          setPrescriptionItem((state) => ({
                            ...state,
                            dosage: e.target.value,
                          }))
                        }
                        placeholder={t("i18nAudit.clinicalWorkspace.dosage")}
                        className="rounded-xl bg-background"
                      />
                      <Input
                        value={prescriptionItem.frequency}
                        onChange={(e) =>
                          setPrescriptionItem((state) => ({
                            ...state,
                            frequency: e.target.value,
                          }))
                        }
                        placeholder={t("i18nAudit.clinicalWorkspace.frequency")}
                        className="rounded-xl bg-background"
                      />
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      <Input
                        value={prescriptionItem.duration}
                        onChange={(e) =>
                          setPrescriptionItem((state) => ({
                            ...state,
                            duration: e.target.value,
                          }))
                        }
                        placeholder={t("i18nAudit.clinicalWorkspace.duration")}
                        className="rounded-xl bg-background"
                      />
                      <Input
                        value={prescriptionItem.instructions}
                        onChange={(e) =>
                          setPrescriptionItem((state) => ({
                            ...state,
                            instructions: e.target.value,
                          }))
                        }
                        placeholder={t("i18nAudit.clinicalWorkspace.instructions")}
                        className="rounded-xl bg-background"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddPrescriptionItem}
                      className="rounded-xl border-primary/30"
                    >
                      <HugeiconsIcon
                        icon={PlusSignIcon}
                        className="mr-2 h-4 w-4"
                      />
                      {t("i18nAudit.clinicalWorkspace.addMedicine")}
                    </Button>

                    <div className="rounded-2xl border border-border/60 bg-background/80">
                      <div className="flex items-center justify-between border-b px-4 py-3">
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-muted-foreground">
                          {t("i18nAudit.clinicalWorkspace.prescriptionItems")}
                        </p>
                        <Badge variant="outline">
                          {prescriptionItems.length}
                        </Badge>
                      </div>
                      {prescriptionItems.length === 0 ? (
                        <p className="p-4 text-sm text-muted-foreground">
                          {t("i18nAudit.clinicalWorkspace.noMedicines")}
                        </p>
                      ) : (
                        <div className="divide-y">
                          {prescriptionItems.map((item, index) => (
                            <div
                              key={`${item.medicine_name}-${index}`}
                              className="flex items-start justify-between gap-3 p-4"
                            >
                              <div>
                                <p className="font-bold">
                                  {item.medicine_name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {item.dosage} · {item.frequency} ·{" "}
                                  {item.duration}
                                </p>
                                {item.instructions && (
                                  <p className="mt-1 text-xs">
                                    {item.instructions}
                                  </p>
                                )}
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleRemovePrescriptionItem(index)
                                }
                                className="text-rose-600"
                              >
                                {t("i18nAudit.clinicalWorkspace.remove")}
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <Button
                      onClick={handleCreatePrescription}
                      disabled={
                        actionState === "loading" ||
                        prescriptionItems.length === 0
                      }
                      className="rounded-xl"
                    >
                      {t("i18nAudit.clinicalWorkspace.issuePrescription", { count: prescriptionItems.length })}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
                  <div className="flex items-center gap-2">
                    <HugeiconsIcon
                      icon={Clock03Icon}
                      className="h-5 w-5 text-primary"
                    />
                    <h3 className="text-base font-bold">{t("i18nAudit.clinicalWorkspace.requestLabTests")}</h3>
                  </div>
                  <div className="mt-4 space-y-4">
                    <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                      <select
                        className="h-10 rounded-2xl border border-input bg-background px-3 text-sm outline-none"
                        value={selectedLabTestUuid}
                        onChange={(e) => setSelectedLabTestUuid(e.target.value)}
                      >
                        <option value="">{t("i18nAudit.clinicalWorkspace.selectTest")}</option>
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
                        {t("i18nAudit.clinicalWorkspace.addToRequest")}
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {selectedLabTestUuids.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          {t("i18nAudit.clinicalWorkspace.noTests")}
                        </p>
                      ) : (
                        selectedLabTestUuids.map((uuid) => {
                          const test = labTests.find(
                            (entry) => entry.uuid === uuid,
                          );
                          return (
                            <button
                              key={uuid}
                              type="button"
                              onClick={() => handleRemoveLabTest(uuid)}
                              className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary transition hover:bg-primary/10"
                            >
                              {test?.name || t("i18nAudit.clinicalWorkspace.selectedTest")}
                              <span className="text-primary/60">×</span>
                            </button>
                          );
                        })
                      )}
                    </div>

                    <Button
                      onClick={handleCreateLabRequest}
                      disabled={
                        actionState === "loading" ||
                        selectedLabTestUuids.length === 0
                      }
                      className="rounded-2xl"
                    >
                      {t("i18nAudit.clinicalWorkspace.sendLabRequest")}
                    </Button>
                  </div>
                </div>

                <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
                  <h3 className="text-base font-bold">{t("i18nAudit.clinicalWorkspace.ordersWorkflow")}</h3>
                  <div className="mt-4 space-y-5">
                    <div className="space-y-3">
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                        {t("i18nAudit.clinicalWorkspace.prescriptions")}
                      </p>
                      {consultationPrescriptions.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          {t("i18nAudit.clinicalWorkspace.noPrescriptions")}
                        </p>
                      ) : (
                        consultationPrescriptions.map(
                          (prescription, prescriptionIndex) => (
                            <div
                              key={prescription.uuid}
                              className="overflow-hidden rounded-2xl border border-border/60"
                            >
                              <div className="flex items-center justify-between bg-muted/30 px-4 py-3">
                                <p className="text-sm font-bold">
                                  {t("i18nAudit.clinicalWorkspace.prescriptionNumber", { number: prescriptionIndex + 1 })}
                                </p>
                                <Badge variant="outline">
                                  {t("i18nAudit.clinicalWorkspace.medicineCount", { count: prescription.items.length })}
                                </Badge>
                              </div>
                              <div className="divide-y">
                                {prescription.items.map((item) => (
                                  <div key={item.uuid} className="p-3">
                                    <p className="font-semibold">
                                      {item.medicine_name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {item.dosage} · {item.frequency} ·{" "}
                                      {item.duration}
                                    </p>
                                    {item.instructions && (
                                      <p className="mt-1 text-xs">
                                        {item.instructions}
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                              {prescription.notes && (
                                <p className="border-t bg-muted/20 p-3 text-xs text-muted-foreground">
                                  {prescription.notes}
                                </p>
                              )}
                            </div>
                          ),
                        )
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                        {t("i18nAudit.clinicalWorkspace.labRequests")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t("i18nAudit.clinicalWorkspace.requestCount", { count: consultationLabRequests.length })}
                      </p>
                    </div>

                    <div className="space-y-3 border-t border-border/60 pt-4">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                          {t("i18nAudit.clinicalWorkspace.labReplies")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {t("i18nAudit.clinicalWorkspace.labRepliesHelp")}
                        </p>
                      </div>

                      {consultationLabRequestsWithResults.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-border/60 bg-muted/20 p-4">
                          <p className="text-sm text-muted-foreground">
                            {t("i18nAudit.clinicalWorkspace.noLabRequests")}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {consultationLabRequestsWithResults.map((request) => (
                            <div
                              key={request.uuid}
                              className="rounded-2xl border border-border/60 bg-muted/10 p-4"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                  <p className="text-sm font-bold text-foreground">
                                    {t("i18nAudit.clinicalWorkspace.appointmentReference", { id: request.appointment_uuid.slice(0, 8) })}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {t("i18nAudit.clinicalWorkspace.requestSummary", {
                                      id: request.uuid.slice(0, 8),
                                      count: request.items.length,
                                    })}
                                  </p>
                                </div>
                                <Badge
                                  variant="outline"
                                  className="rounded-full"
                                >
                                  {request.status.replace("_", " ")}
                                </Badge>
                              </div>

                              <div className="mt-4 space-y-3">
                                {request.items.map((item) => {
                                  const reply = item.result;
                                  return (
                                    <div
                                      key={item.uuid}
                                      className="rounded-2xl border border-border/60 bg-card p-3"
                                    >
                                      <div className="flex flex-wrap items-center justify-between gap-2">
                                        <p className="font-semibold">
                                          {item.test_type_name}
                                        </p>
                                        {reply ? (
                                          <Badge className="rounded-full bg-emerald-500 text-white">
                                            {t("i18nAudit.clinicalWorkspace.answered")}
                                          </Badge>
                                        ) : (
                                          <Badge
                                            variant="outline"
                                            className="rounded-full"
                                          >
                                            {t("i18nAudit.clinicalWorkspace.waiting")}
                                          </Badge>
                                        )}
                                      </div>
                                      {reply ? (
                                        <div className="mt-3 grid gap-2">
                                          <div className="rounded-xl bg-muted/20 p-3">
                                            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">
                                              {t("i18nAudit.clinicalWorkspace.result")}
                                            </p>
                                            <p className="mt-1 font-semibold">
                                              {reply.result}
                                            </p>
                                          </div>
                                          <div className="rounded-xl bg-muted/20 p-3">
                                            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">
                                              {t("i18nAudit.clinicalWorkspace.labRemarks")}
                                            </p>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                              {reply.remarks || t("i18nAudit.clinicalWorkspace.noRemarks")}
                                            </p>
                                          </div>
                                          <p className="text-[11px] text-muted-foreground">
                                            {t("i18nAudit.clinicalWorkspace.verifiedBy", {
                                              name: reply.verified_by_name,
                                              date: formatVerificationTime(reply.verified_at),
                                            })}
                                          </p>
                                        </div>
                                      ) : (
                                        <p className="mt-3 text-sm text-muted-foreground">
                                          {t("i18nAudit.clinicalWorkspace.noReply")}
                                        </p>
                                      )}
                                    </div>
                                  );
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
            </div>

            <div className="">
              <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
                <h3 className="text-base font-bold">{t("i18nAudit.clinicalWorkspace.diagnosisLog")}</h3>
                <div className="mt-4 space-y-3">
                  {consultationDiagnoses.length ? (
                    consultationDiagnoses.map((diagnosis) => (
                      <div
                        key={diagnosis.uuid}
                        className="rounded-2xl border border-border/60 p-3"
                      >
                        <p className="font-semibold">
                          {diagnosis.disease_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {diagnosis.type}{" "}
                          {diagnosis.icd10_code
                            ? `• ${diagnosis.icd10_code}`
                            : ""}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {t("i18nAudit.clinicalWorkspace.noDiagnoses")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
