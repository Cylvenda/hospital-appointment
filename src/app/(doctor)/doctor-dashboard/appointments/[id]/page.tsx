"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppointmentStore } from "@/store/appointments/appointment.store";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft02Icon,
  MedicalFileIcon,
  StethoscopeIcon,
} from "@hugeicons/core-free-icons";
import { DoctorAppointmentCard } from "@/components/customs/doctor-appointment-card";
import { ClinicalWorkspace } from "@/components/customs/clinical-workspace";
import { useTranslation } from "@/lib/i18n";

export default function DoctorSingleAppointmentPage() {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { appointments, initialized, initialize } = useAppointmentStore();
  const loading = !initialized;

  useEffect(() => {
    if (!initialized) {
      void initialize();
    }
  }, [initialize, initialized]);

  if (loading) {
    return (
      <div className="w-full flex h-64 items-center justify-center rounded-4xl border border-dashed border-border bg-card">
        <p className="text-sm text-muted-foreground animate-pulse">
          {t("appointmentDetailPage.loading")}
        </p>
      </div>
    );
  }

  const appointment = appointments.find((a) => a.id === id);

  if (!appointment && appointments.length > 0) {
    return (
      <div className="flex w-full flex-col items-center gap-4 rounded-4xl border border-dashed border-border bg-card p-10 text-center">
        <p className="text-sm text-muted-foreground">
          {t("appointmentDetailPage.notFound")}
        </p>
        <Button
          onClick={() => router.push("/doctor-dashboard/appointments/all")}
          variant="outline"
        >
          {t("appointmentDetailPage.back")}
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-8xl space-y-6 p-4 md:p-8">
      <section className="relative overflow-hidden rounded-3xl bg-primary text-white shadow-xl">
        <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
        <div className="relative flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div className="flex items-start gap-4">
            <Button
              variant="ghost"
              size="icon-lg"
              onClick={() => router.back()}
              className="shrink-0 rounded-2xl bg-white/10 text-white hover:bg-white/20 hover:text-white"
            >
              <HugeiconsIcon icon={ArrowLeft02Icon} className="h-6 w-6" />
            </Button>
            <div>
              <p className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-emerald-300">
                <HugeiconsIcon icon={StethoscopeIcon} className="h-4 w-4" />
                {t("appointmentDetailPage.clinicalConsole")}
              </p>
              <h1 className="text-3xl font-black tracking-tight md:text-4xl">
                {t("appointmentDetailPage.patientEncounter")}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-300">
                {t("appointmentDetailPage.clinicalDescription")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
            <HugeiconsIcon icon={MedicalFileIcon} className="h-5 w-5 text-emerald-300" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                {t("appointmentDetailPage.reference")}
              </p>
              <p className="font-mono text-sm font-bold">{id?.slice(0, 8) || id}</p>
            </div>
          </div>
        </div>
      </section>

      {appointment && (
        <div className="space-y-8">
          <DoctorAppointmentCard
            appointment={appointment}
            hideViewDetails={true}
          />

          <ClinicalWorkspace appointment={appointment} />
        </div>
      )}
    </div>
  );
}
