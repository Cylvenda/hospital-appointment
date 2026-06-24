"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppointmentStore } from "@/store/appointments/appointment.store";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import { DoctorAppointmentCard } from "@/components/customs/doctor-appointment-card";
import { ClinicalWorkspace } from "@/components/customs/clinical-workspace";

export default function DoctorSingleAppointmentPage() {
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
          Loading appointment details...
        </p>
      </div>
    );
  }

  const appointment = appointments.find((a) => a.id === id);

  if (!appointment && appointments.length > 0) {
    return (
      <div className="flex w-full flex-col items-center gap-4 rounded-4xl border border-dashed border-border bg-card p-10 text-center">
        <p className="text-sm text-muted-foreground">
          Appointment not found or you do not have permission to view it.
        </p>
        <Button
          onClick={() => router.push("/doctor-dashboard/appointments/all")}
          variant="outline"
        >
          Back to Appointments
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-8xl mx-auto space-y-8">
      <div className="flex items-center gap-4 rounded-3xl border bg-card p-4 shadow-sm">
        <Button
          variant="ghost"
          size="icon-lg"
          onClick={() => router.back()}
          className="shrink-0 rounded-2xl hover:bg-muted"
        >
          <HugeiconsIcon icon={ArrowLeft02Icon} className="h-6 w-6" />
        </Button>
        <div>
          <h1 className="text-2xl font-black tracking-tight">
            Clinical Assessment Details
          </h1>
          <p className="text-sm font-medium text-muted-foreground">
            View full details for appointment #{id?.slice(0, 8) || id}
          </p>
        </div>
      </div>

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
