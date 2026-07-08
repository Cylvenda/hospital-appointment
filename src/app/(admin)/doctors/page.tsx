"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/lib/i18n";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Calendar01Icon,
  CallIcon,
  Doctor01Icon,
  FilterIcon,
  Mail01Icon,
  PlusSignIcon,
  Search01Icon,
  Watch01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "react-toastify";
import { useAdminStore } from "@/store/admin/admin.store";
import { PasswordInput } from "@/components/password-input";
import { Label } from "@/components/ui/label";
import { DoctorScheduleManager } from "@/components/doctor-schedule-manager";
import { DoctorProfileManager } from "@/components/doctor-profile-manager";
import { cn } from "@/lib/utils";
import { getBackendFieldErrors } from "@/lib/backend-errors";

type FormErrors = {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  password?: string;
  license_number?: string;
};

const emptyDoctorForm = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  password: "",
  license_number: "",
  category_uuids: [] as string[],
};

function statusClasses(status: string) {
  if (status === "Available") {
    return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/20";
  }

  if (status === "In Session") {
    return "bg-amber-50 text-amber-700 ring-1 ring-amber-100 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/20";
  }

  return "bg-muted text-muted-foreground ring-1 ring-border";
}

export default function DoctorsPage() {
  const { t } = useTranslation();
  const {
    doctors: doctorDirectory,
    illnessCategories,
    fetchDoctors,
    fetchIllnessCategories,
    createDoctor,
  } = useAdminStore();
  const [search, setSearch] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [form, setForm] = useState(emptyDoctorForm);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleDoctorFieldChange = (
    field: keyof typeof emptyDoctorForm,
    value: string | string[],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field !== "category_uuids" && formErrors[field as keyof FormErrors]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };
  useEffect(() => {
    void fetchDoctors();
    void fetchIllnessCategories();
  }, [fetchDoctors, fetchIllnessCategories]);

  const doctors = useMemo(
    () =>
      doctorDirectory
        .filter((doctor) =>
          [doctor.name, doctor.email, doctor.phone, doctor.categories.join(" ")]
            .join(" ")
            .toLowerCase()
            .includes(search.trim().toLowerCase()),
        )
        .map((doctor) => ({
          uuid: doctor.uuid,
          id: doctor.uuid.slice(0, 8).toUpperCase(),
          name: doctor.name,
          specialty: doctor.categories[0] || t("adminDoctors.general"),
          email: doctor.email,
          phone: doctor.phone,
          shift: doctor.is_available
            ? t("adminDoctors.availableToday")
            : t("adminDoctors.unavailable"),
          nextClinic: t("adminDoctors.seeSchedule"),
          status: doctor.is_available
            ? t("adminDoctors.available")
            : t("adminDoctors.offDuty"),
        })),
    [doctorDirectory, search, t],
  );

  const isFormValid =
    form.first_name.trim() &&
    form.last_name.trim() &&
    form.email.trim() &&
    form.phone.trim() &&
    form.password.trim() &&
    form.license_number.trim();

  async function handleCreateDoctor() {
    if (!isFormValid || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setFormErrors({});

    try {
      await createDoctor({
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        license_number: form.license_number.trim(),
        is_available: true,
        category_uuids: form.category_uuids,
      });
      toast.success(t("adminDoctors.doctorAddedSuccess"));
      setForm(emptyDoctorForm);
      setSheetOpen(false);
    } catch (error: unknown) {
      const backendErrors = getBackendFieldErrors(error, [
        "first_name",
        "last_name",
        "email",
        "phone",
        "password",
        "license_number",
      ]);
      if (Object.keys(backendErrors).length > 0) {
        setFormErrors(backendErrors);
      } else {
        toast.error(t("adminDoctors.doctorAddFailed"));
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full space-y-6 p-4 md:p-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="space-y-1">
          <h1 className="font-heading text-2xl font-semibold">
            {t("adminDoctors.doctors")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("adminDoctors.doctorsDesc")}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative sm:w-80">
            <HugeiconsIcon
              icon={Search01Icon}
              strokeWidth={1.8}
              className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-11 rounded-2xl border-2 border-sidebar-border pl-11"
              placeholder={t("adminDoctors.searchDoctorOrSpecialty")}
            />
          </div>
          <Button variant="outline" size="lg" className="rounded-md">
            <HugeiconsIcon icon={FilterIcon} strokeWidth={1.8} />
            {t("adminDoctors.filter")}
          </Button>
          <Button
            size="lg"
            className="rounded-md"
            onClick={() => setSheetOpen(true)}
          >
            <HugeiconsIcon icon={PlusSignIcon} strokeWidth={1.8} />
            {t("adminDoctors.addDoctor")}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-4xl border border-sidebar-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">
            {t("adminDoctors.totalDoctors")}
          </p>
          <p className="mt-2 text-3xl font-semibold">{doctors.length}</p>
        </div>
        <div className="rounded-4xl border border-sidebar-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">
            {t("adminDoctors.availableNow")}
          </p>
          <p className="mt-2 text-3xl font-semibold">
            {
              doctors.filter(
                (doctor) => doctor.status === t("adminDoctors.available"),
              ).length
            }
          </p>
        </div>
        <div className="rounded-4xl border border-sidebar-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">
            {t("adminDoctors.inSession")}
          </p>
          <p className="mt-2 text-3xl font-semibold">
            {
              doctors.filter(
                (doctor) => doctor.status === t("adminDoctors.inSession"),
              ).length
            }
          </p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {doctors.map((doctor) => (
          <div
            key={doctor.id}
            className="rounded-4xl border border-sidebar-border bg-card p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <HugeiconsIcon icon={Doctor01Icon} strokeWidth={1.8} />
                </div>
                <div className="space-y-1">
                  <p className="font-semibold">{doctor.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {doctor.specialty}
                  </p>
                  <p className="font-mono text-xs text-muted-foreground">
                    {doctor.id}
                  </p>
                </div>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${statusClasses(doctor.status)}`}
              >
                {doctor.status}
              </span>
            </div>

            <div className="mt-5 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
              <p className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={Mail01Icon}
                  strokeWidth={1.8}
                  className="size-4"
                />
                {doctor.email}
              </p>
              <p className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={CallIcon}
                  strokeWidth={1.8}
                  className="size-4"
                />
                {doctor.phone}
              </p>
              <p className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={Watch01Icon}
                  strokeWidth={1.8}
                  className="size-4"
                />
                {t("adminDoctors.shift")} {doctor.shift}
              </p>
              <p className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={Calendar01Icon}
                  strokeWidth={1.8}
                  className="size-4"
                />
                {t("adminDoctors.nextClinic")} {doctor.nextClinic}
              </p>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {(() => {
                const record = doctorDirectory.find(
                  (item) => item.uuid === doctor.uuid,
                );
                return record ? <DoctorProfileManager doctor={record} /> : null;
              })()}
              {(() => {
                const record = doctorDirectory.find(
                  (item) => item.uuid === doctor.uuid,
                );
                return record ? (
                  <DoctorScheduleManager doctor={record} />
                ) : null;
              })()}
            </div>
          </div>
        ))}
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-2xl">
          <SheetHeader className="border-b border-sidebar-border">
            <SheetTitle>{t("adminDoctors.addDoctorTitle")}</SheetTitle>
            <SheetDescription>
              {t("adminDoctors.createDoctorRecord")}
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4 p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("adminDoctors.firstName")}
                </label>
                <Input
                  value={form.first_name}
                  onChange={(event) =>
                    handleDoctorFieldChange("first_name", event.target.value)
                  }
                  className={formErrors.first_name ? "border-red-500" : ""}
                />
                {formErrors.first_name && (
                  <p className="text-sm text-red-500">
                    {formErrors.first_name}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("adminDoctors.lastName")}
                </label>
                <Input
                  value={form.last_name}
                  onChange={(event) =>
                    handleDoctorFieldChange("last_name", event.target.value)
                  }
                  className={formErrors.last_name ? "border-red-500" : ""}
                />
                {formErrors.last_name && (
                  <p className="text-sm text-red-500">{formErrors.last_name}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("adminDoctors.email")}
                </label>
                <Input
                  value={form.email}
                  onChange={(event) =>
                    handleDoctorFieldChange("email", event.target.value)
                  }
                  className={formErrors.email ? "border-red-500" : ""}
                />
                {formErrors.email && (
                  <p className="text-sm text-red-500">{formErrors.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("adminDoctors.phone")}
                </label>
                <Input
                  value={form.phone}
                  onChange={(event) =>
                    handleDoctorFieldChange("phone", event.target.value)
                  }
                  className={formErrors.phone ? "border-red-500" : ""}
                />
                {formErrors.phone && (
                  <p className="text-sm text-red-500">{formErrors.phone}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">
                {t("adminDoctors.initialPassword")}
              </Label>
              <PasswordInput
                id="password"
                placeholder={t("adminDoctors.minimum8Characters")}
                className={
                  formErrors.password
                    ? "rounded-xl h-11 border-red-500"
                    : "rounded-xl h-11"
                }
                required
                value={form.password}
                onChange={(event) =>
                  handleDoctorFieldChange("password", event.target.value)
                }
              />
              {formErrors.password && (
                <p className="text-sm text-red-500">{formErrors.password}</p>
              )}
              <p className="text-[10px] text-muted-foreground mt-1">
                {t("adminDoctors.doctorPasswordChangeDesc")}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("adminDoctors.licenseNumber")}
              </label>
              <Input
                value={form.license_number}
                onChange={(event) =>
                  handleDoctorFieldChange("license_number", event.target.value)
                }
                className={formErrors.license_number ? "border-red-500" : ""}
              />
              {formErrors.license_number && (
                <p className="text-sm text-red-500">
                  {formErrors.license_number}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Departments</Label>
              <p className="text-xs text-muted-foreground">
                Select every department where this doctor can work.
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {illnessCategories.map((category) => {
                  const selected = form.category_uuids.includes(category.uuid);
                  return (
                    <button
                      key={category.uuid}
                      type="button"
                      onClick={() =>
                        setForm((current) => ({
                          ...current,
                          category_uuids: selected
                            ? current.category_uuids.filter(
                                (uuid) => uuid !== category.uuid,
                              )
                            : [...current.category_uuids, category.uuid],
                        }))
                      }
                      className={cn(
                        "rounded-xl border p-3 text-left text-sm",
                        selected
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border",
                      )}
                    >
                      {category.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <SheetFooter className="border-t border-sidebar-border">
            <Button variant="outline" onClick={() => setSheetOpen(false)}>
              {t("adminDoctors.cancel")}
            </Button>
            <Button
              onClick={handleCreateDoctor}
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting
                ? t("adminDoctors.saving")
                : t("adminDoctors.saveDoctor")}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
