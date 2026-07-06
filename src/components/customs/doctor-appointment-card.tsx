"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import { useAppointmentStore } from "@/store/appointments/appointment.store";
import type { Appointment } from "@/store/appointments/appointment.types";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Clock01Icon,
  UserIcon,
  MedicineBottle01Icon,
  Tick02Icon,
  Cancel01Icon,
  Note01Icon,
  Doctor01Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { getAppointmentStatusMeta } from "@/lib/appointment-workflow";
import { hasAppointmentStatus } from "@/lib/appointment-queues";
import { useTranslation } from "@/lib/i18n";

type Props = {
  appointment: Appointment;
  hideViewDetails?: boolean;
};

export const DoctorAppointmentCard = ({
  appointment,
  hideViewDetails = false,
}: Props) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { updateAppointment, startConsultation } = useAppointmentStore();
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states for completion
  const [diagnosis, setDiagnosis] = useState(appointment.diagnosis || "");
  const [clinicalNotes, setClinicalNotes] = useState(appointment.notes || "");
  const statusMeta = getAppointmentStatusMeta(
    appointment.status,
    appointment.paymentStatus,
    "doctor",
  );
  const toneStyles = {
    amber: "bg-amber-100 text-amber-700 border-amber-200",
    emerald: "bg-emerald-100 text-emerald-700 border-emerald-200",
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    rose: "bg-rose-100 text-rose-700 border-rose-200",
    slate: "bg-slate-100 text-slate-700 border-slate-200",
  } as const;
  const isAssigned = hasAppointmentStatus(
    appointment,
    "confirmed",
    "waiting_in_queue",
    "in_consultation",
    "back_to_doctor"
  );
  const isCompleted = hasAppointmentStatus(appointment, "completed");
  const isReadyToStart = hasAppointmentStatus(
    appointment,
    "waiting_in_queue",
    "back_to_doctor"
  );
  const canComplete = hasAppointmentStatus(appointment, "in_consultation");

  const handleStart = async () => {
    setLoading(true);
    try {
      await startConsultation(appointment.id);
      toast.success(
        appointment.status === "back_to_doctor"
          ? t("doctorCard.labReviewResumed")
          : t("doctorCard.consultationStarted")
      );
    } catch {
      toast.error(t("doctorCard.consultationStartError"));
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!diagnosis.trim()) {
      toast.error(t("doctorCard.requireDiagnosis"));
      return;
    }

    setLoading(true);
    try {
      await updateAppointment(appointment.id, {
        status: "completed",
        diagnosis: diagnosis.trim(),
        notes: clinicalNotes.trim(),
      });
      toast.success(t("doctorCard.completeSuccess"));
      setIsCompleteOpen(false);
    } catch {
      toast.error(t("doctorCard.completeError"));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    setLoading(true);
    try {
      await updateAppointment(appointment.id, { status: "cancelled" });
      toast.success(t("doctorCard.cancelSuccess"));
      setIsCancelOpen(false);
    } catch {
      toast.error(t("doctorCard.cancelError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <Card className="group overflow-hidden rounded-[1.25rem] border border-border/60 bg-card/95 shadow-[0_12px_28px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(15,23,42,0.08)]">
        <CardContent className="p-0">
          <div className="h-1 bg-gradient-to-r from-primary via-emerald-500 to-blue-500" />
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_15rem]">
            <div className="p-4 sm:p-5">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant="outline"
                        className="rounded-full border-border/70 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground"
                      >
                        {t("doctorCard.appointmentId", {
                          id: appointment.appointmentId ?? t("appointments.pending"),
                        })}
                      </Badge>
                      {appointment.queueNumber && (
                        <Badge className="rounded-full bg-blue-600 text-white">
                          {t("doctorCard.queueNumber", { number: appointment.queueNumber })}
                        </Badge>
                      )}
                      <div
                        className={cn(
                          "rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.2em]",
                          toneStyles[statusMeta.tone],
                        )}
                      >
                        {statusMeta.label}
                      </div>
                    </div>
                    <div className="mt-2.5 flex items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm ring-1 ring-primary/10">
                        <HugeiconsIcon icon={UserIcon} className="h-6 w-6" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate text-[1.5rem] font-black tracking-tight sm:text-[1.7rem]">
                          {appointment.patient}
                        </h3>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {appointment.email}
                        </p>
                        <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-muted-foreground/80">
                          {appointment.note}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2 lg:w-[15rem]">
                    <div className="rounded-2xl border border-border/60 bg-muted/20 px-3 py-2.5 shadow-sm">
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">
                        {t("doctorCard.date")}
                      </p>
                      <p className="mt-1 text-xs font-bold text-foreground">
                        {appointment.date || t("doctorCard.notScheduled")}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-border/60 bg-muted/20 px-3 py-2.5 shadow-sm">
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">
                        {t("doctorCard.time")}
                      </p>
                      <p className="mt-1 flex items-center gap-2 text-xs font-bold text-foreground">
                        <HugeiconsIcon
                          icon={Clock01Icon}
                          className="h-3.5 w-3.5 text-primary"
                        />
                        {appointment.startTime || "--:--"} -{" "}
                        {appointment.endTime || "--:--"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-2.5 md:grid-cols-3">
                  {[
                    {
                      label: t("doctorCard.diagnosis"),
                      value: appointment.diagnosis || t("doctorCard.pendingReview"),
                      tone: "blue",
                    },
                    {
                      label: t("doctorCard.notes"),
                      value: appointment.notes || t("doctorCard.noClinicalNotes"),
                      tone: "slate",
                    },
                    {
                      label: t("doctorCard.doctor"),
                      value: appointment.doctor || t("doctorCard.unassigned"),
                      tone: "emerald",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-border/60 bg-card p-3 shadow-sm"
                    >
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">
                        {item.label}
                      </p>
                      <p className="mt-1.5 line-clamp-2 text-xs font-medium leading-5 text-foreground">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                {isCompleted && appointment.diagnosis && (
                  <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent p-3.5 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-700">
                        <HugeiconsIcon
                          icon={Tick02Icon}
                          className="h-3.5 w-3.5"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-blue-700/70">
                          {t("doctorCard.recordedDiagnosis")}
                        </p>
                        <p className="mt-1 text-sm font-bold text-foreground">
                          {appointment.diagnosis}
                        </p>
                        {appointment.notes && (
                          <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                            {appointment.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-border/60 bg-muted/20 p-4 lg:border-l lg:border-t-0 lg:p-5">
              <div className="flex h-full flex-col justify-between gap-4">
                <div className="rounded-2xl border border-border/60 bg-card p-3.5 shadow-sm">
                  <div className="flex items-center gap-2">
                    <HugeiconsIcon
                      icon={InformationCircleIcon}
                      className="h-3.5 w-3.5 text-primary"
                    />
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">
                      {t("doctorCard.status")}
                    </p>
                  </div>
                  <p className="mt-1.5 text-xs font-medium leading-5 text-muted-foreground">
                    {statusMeta.summary}
                  </p>
                </div>

                <div className="space-y-2.5">
                  {isAssigned && (
                    <>
                      {isReadyToStart && (
                        <Button
                          onClick={handleStart}
                          disabled={loading}
                          className="h-10 w-full rounded-full"
                        >
                          {t("doctorCard.startConsultation")}
                        </Button>
                      )}
                      {canComplete && (
                      <Button
                        onClick={() => setIsCompleteOpen(true)}
                        className="h-10 w-full rounded-full bg-primary px-4 font-black shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-95"
                      >
                        <HugeiconsIcon
                          icon={Tick02Icon}
                          className="mr-2 h-4 w-4"
                        />
                        {t("doctorCard.completeVisit")}
                      </Button>
                      )}
                      <Button
                        variant="outline"
                        onClick={() => setIsCancelOpen(true)}
                        className="h-10 w-full rounded-full border-2 border-rose-200 px-4 font-bold text-rose-600 transition-all hover:bg-rose-50"
                      >
                        <HugeiconsIcon
                          icon={Cancel01Icon}
                          className="mr-2 h-4 w-4"
                        />
                        {t("doctorCard.cancelVisit")}
                      </Button>
                    </>
                  )}

                  {!hideViewDetails && (
                    <Button
                      variant="outline"
                      onClick={() =>
                        router.push(
                          `/doctor-dashboard/appointments/${appointment.id}`,
                        )
                      }
                      className="h-10 w-full rounded-full border-2 border-border/70 px-4 font-semibold shadow-sm transition-all hover:bg-muted/60"
                    >
                      {t("doctorCard.viewDetails")}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Completion Dialog */}
      <Dialog open={isCompleteOpen} onOpenChange={setIsCompleteOpen}>
        <DialogContent className="sm:max-w-2xl rounded-md p-0 overflow-hidden border-none shadow-2xl">
          <div className="bg-primary p-6 text-white">
            <DialogHeader>
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-4 backdrop-blur-md">
                <HugeiconsIcon
                  icon={Doctor01Icon}
                  className="w-6 h-6 text-white"
                />
              </div>
              <DialogTitle className="text-3xl font-black tracking-tight text-white">
                {t("doctorCard.clinicalAssessment")}
              </DialogTitle>
              <DialogDescription className="text-white/80 font-medium text-lg">
                {t("doctorCard.clinicalAssessmentDescription", {
                  patient: appointment.patient,
                })}
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="space-y-5 p-6 sm:p-7">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-4 bg-primary rounded-full" />
                <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground opacity-60">
                  {t("doctorCard.primaryDiagnosis")}
                </h3>
              </div>
              <div className="relative group">
                <HugeiconsIcon
                  icon={MedicineBottle01Icon}
                  className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors"
                />
                <input
                  type="text"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder={t("doctorCard.primaryDiagnosisPlaceholder")}
                  className="h-12 w-full rounded-md border-2 bg-muted/20 pl-14 pr-5 text-base font-bold outline-none transition-all focus:border-primary focus:bg-background"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-4 bg-primary rounded-full" />
                <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground opacity-60">
                  {t("doctorCard.treatmentNotes")}
                </h3>
              </div>
              <div className="relative group">
                <HugeiconsIcon
                  icon={Note01Icon}
                  className="absolute left-5 top-5 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors"
                />
                <Textarea
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  placeholder={t("doctorCard.treatmentNotesPlaceholder")}
                  className="min-h-32 resize-none rounded-md border-2 border-secondary bg-muted/20 pl-14 pt-4 text-base font-medium outline-none transition-all focus:border-primary focus:bg-background"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="flex items-center justify-between gap-4 border-t bg-muted/30 p-6 sm:p-7">
            <Button
              variant="ghost"
              onClick={() => setIsCompleteOpen(false)}
              disabled={loading}
              className="h-10 rounded-md px-6 font-bold text-muted-foreground hover:text-foreground"
            >
              {t("common.cancel")}
            </Button>
            <Button
              onClick={handleComplete}
              disabled={loading}
              className="h-10 rounded-md px-6 font-black shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
            >
              <HugeiconsIcon icon={Tick02Icon} className="mr-2 h-4 w-4" />
              {loading ? t("doctorCard.recording") : t("doctorCard.finalizeComplete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancellation Dialog */}
      <Dialog open={isCancelOpen} onOpenChange={setIsCancelOpen}>
        <DialogContent className="sm:max-w-md rounded-md p-7 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-600">
            <HugeiconsIcon icon={Cancel01Icon} className="h-8 w-8" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tight text-center">
              {t("doctorCard.cancelAppointmentTitle")}
            </DialogTitle>
            <DialogDescription className="pt-2 text-base font-medium text-center">
              {t("doctorCard.cancelAppointmentDescription")}{" "}
              <span className="text-foreground font-bold">
                {appointment.patient}
              </span>
              ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col items-center justify-between gap-3 pt-6 sm:flex-row">
            <Button
              variant="ghost"
              onClick={() => setIsCancelOpen(false)}
              disabled={loading}
              className="h-10 rounded-md border-secondary font-bold"
            >
              {t("staffAppointmentCard.goBack")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={loading}
              className="h-10 rounded-md border-secondary font-bold"
            >
              {loading ? t("doctorCard.cancelling") : t("doctorCard.confirmCancellation")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};
