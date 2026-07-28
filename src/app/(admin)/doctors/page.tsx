"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTranslation } from "@/lib/i18n"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  CallIcon,
  Doctor01Icon,
  FilterIcon,
  Mail01Icon,
  PlusSignIcon,
  Search01Icon,
  Delete02Icon,
  ViewIcon,
  Edit02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { toast } from "react-toastify"
import { useAdminStore } from "@/store/admin/admin.store"
import { PasswordInput } from "@/components/password-input"
import { Label } from "@/components/ui/label"
import { DoctorScheduleManager } from "@/components/doctor-schedule-manager"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"
import { getBackendFieldErrors } from "@/lib/backend-errors"

type FormErrors = {
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
  password?: string
  license_number?: string
}

const emptyDoctorForm = {
  uuid: "",
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  password: "",
  license_number: "",
  category_uuids: [] as string[],
  is_available: true,
}

type ViewEditMode = "view" | "edit" | null

function statusClasses(status: string) {
  if (status === "Available") {
    return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/20"
  }

  if (status === "In Session") {
    return "bg-amber-50 text-amber-700 ring-1 ring-amber-100 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/20"
  }

  return "bg-muted text-muted-foreground ring-1 ring-border"
}

export default function DoctorsPage() {
  const { t } = useTranslation()
  const {
    doctors: doctorDirectory,
    illnessCategories,
    fetchDoctors,
    fetchIllnessCategories,
    createDoctor,
    updateDoctor,
    deleteDoctor,
  } = useAdminStore()
  const [search, setSearch] = useState("")
  const [sheetOpen, setSheetOpen] = useState(false)
  const [form, setForm] = useState(emptyDoctorForm)
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [viewEditMode, setViewEditMode] = useState<ViewEditMode>(null)
  const [activeDoctor, setActiveDoctor] = useState<typeof emptyDoctorForm | null>(null)
  const [editForm, setEditForm] = useState(emptyDoctorForm)
  const [editErrors, setEditErrors] = useState<FormErrors>({})
  const [editSubmitting, setEditSubmitting] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<typeof emptyDoctorForm | null>(null)

  const handleDoctorFieldChange = (
    field: keyof typeof emptyDoctorForm,
    value: string | string[],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (field !== "category_uuids" && formErrors[field as keyof FormErrors]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleEditDoctorFieldChange = (
    field: keyof typeof emptyDoctorForm,
    value: string | string[] | boolean,
  ) => {
    setEditForm((prev) => ({ ...prev, [field]: value }))
    if (field !== "category_uuids" && editErrors[field as keyof FormErrors]) {
      setEditErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  useEffect(() => {
    void fetchDoctors()
    void fetchIllnessCategories()
  }, [fetchDoctors, fetchIllnessCategories])

  const doctors = useMemo(
    () =>
      doctorDirectory
        .filter((doctor) =>
          [doctor.name, doctor.email, doctor.phone, doctor.categories.join(" ")]
            .join(" ")
            .toLowerCase()
            .includes(search.trim().toLowerCase())
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
          status: doctor.is_available
            ? t("adminDoctors.available")
            : t("adminDoctors.offDuty"),
        })),
    [doctorDirectory, search, t],
  )

  const isFormValid =
    form.first_name.trim() &&
    form.last_name.trim() &&
    form.email.trim() &&
    form.phone.trim() &&
    form.password.trim() &&
    form.license_number.trim()

  async function handleCreateDoctor() {
    if (!isFormValid || isSubmitting) {
      return
    }

    setIsSubmitting(true)
    setFormErrors({})

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
      })
      toast.success(t("adminDoctors.doctorAddedSuccess"))
      setForm(emptyDoctorForm)
      setSheetOpen(false)
    } catch (error: unknown) {
      const backendErrors = getBackendFieldErrors(error, [
        "first_name",
        "last_name",
        "email",
        "phone",
        "password",
        "license_number",
      ])
      if (Object.keys(backendErrors).length > 0) {
        setFormErrors(backendErrors)
      } else {
        toast.error(t("adminDoctors.doctorAddFailed"))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleView = (doctor: (typeof emptyDoctorForm)) => {
    setActiveDoctor(doctor)
    setEditForm({
      uuid: doctor.uuid,
      first_name: doctor.first_name || "",
      last_name: doctor.last_name || "",
      email: doctor.email || "",
      phone: doctor.phone || "",
      password: "",
      license_number: doctor.license_number,
      category_uuids: doctor.category_uuids,
      is_available: doctor.is_available,
    })
    setViewEditMode("view")
  }

  const handleEdit = (doctor: (typeof emptyDoctorForm)) => {
    setActiveDoctor(doctor)
    setEditForm({
      uuid: doctor.uuid,
      first_name: doctor.first_name || "",
      last_name: doctor.last_name || "",
      email: doctor.email || "",
      phone: doctor.phone || "",
      password: "",
      license_number: doctor.license_number,
      category_uuids: doctor.category_uuids,
      is_available: doctor.is_available,
    })
    setEditErrors({})
    setViewEditMode("edit")
  }

  const handleDelete = (doctor: (typeof emptyDoctorForm)) => {
    setDeleteTarget(doctor)
  }

  function closeViewEditSheet() {
    setViewEditMode(null)
    setActiveDoctor(null)
    setEditForm({
      uuid: "",
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      password: "",
      license_number: "",
      category_uuids: [],
      is_available: true,
    })
    setEditErrors({})
  }

  function closeDeletePopup() {
    setDeleteTarget(null)
  }

  async function confirmDelete() {
    if (!deleteTarget) {
      return
    }

    try {
      await deleteDoctor(deleteTarget.uuid)
      toast.success(t("adminDoctors.doctorDeletedSuccess"))
      if (activeDoctor?.uuid === deleteTarget.uuid) {
        closeViewEditSheet()
      }
      closeDeletePopup()
    } catch {
      toast.error(t("adminDoctors.doctorDeleteFailed"))
      closeDeletePopup()
    }
  }

  async function handleSaveEdit() {
    if (!activeDoctor) {
      return
    }

    setEditSubmitting(true)
    setEditErrors({})

    try {
      await updateDoctor(activeDoctor.uuid, {
        first_name: editForm.first_name.trim(),
        last_name: editForm.last_name.trim(),
        email: editForm.email.trim(),
        phone: editForm.phone.trim(),
        license_number: editForm.license_number.trim(),
        category_uuids: editForm.category_uuids,
        is_available: editForm.is_available,
      })
      toast.success(t("adminDoctors.doctorUpdatedSuccess"))
      closeViewEditSheet()
    } catch (error: unknown) {
      const backendErrors = getBackendFieldErrors(error, [
        "first_name",
        "last_name",
        "email",
        "phone",
        "license_number",
      ])
      if (Object.keys(backendErrors).length > 0) {
        setEditErrors(backendErrors)
      } else {
        toast.error(t("adminDoctors.doctorUpdateFailed"))
      }
    } finally {
      setEditSubmitting(false)
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

      <div className="overflow-hidden rounded-4xl border border-sidebar-border bg-card shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-12">#</TableHead>
              <TableHead>{t("common.name")}</TableHead>
              <TableHead>{t("doctors.specialization")}</TableHead>
              <TableHead>{t("common.email")}</TableHead>
              <TableHead>{t("common.phone")}</TableHead>
              <TableHead>{t("common.status")}</TableHead>
              <TableHead className="text-right">{t("common.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {doctors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  {t("adminDoctors.noneFound")}
                </TableCell>
              </TableRow>
            ) : (
              doctors.map((doctor, index) => {
                const record = doctorDirectory.find(
                  (item) => item.uuid === doctor.uuid,
                )
                return (
                  <TableRow key={doctor.uuid}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                          <HugeiconsIcon icon={Doctor01Icon} strokeWidth={1.8} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground">{doctor.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {doctor.id}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{doctor.specialty}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <HugeiconsIcon icon={Mail01Icon} strokeWidth={1.8} className="size-4" />
                        {doctor.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <HugeiconsIcon icon={CallIcon} strokeWidth={1.8} className="size-4" />
                        {doctor.phone}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusClasses(doctor.status)}`}>
                        {doctor.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="icon-sm"
                          variant="outline"
                          className="rounded-xl"
                          onClick={() => record && handleView({
                            uuid: record.uuid,
                            first_name: record.first_name,
                            last_name: record.last_name,
                            email: record.email,
                            phone: record.phone,
                            password: "",
                            license_number: record.license_number,
                            category_uuids: record.category_uuids,
                            is_available: record.is_available,
                          })}
                        >
                          <HugeiconsIcon icon={ViewIcon} strokeWidth={1.8} className="size-4" />
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="outline"
                          className="rounded-xl"
                          onClick={() => record && handleEdit({
                            uuid: record.uuid,
                            first_name: record.first_name,
                            last_name: record.last_name,
                            email: record.email,
                            phone: record.phone,
                            password: "",
                            license_number: record.license_number,
                            category_uuids: record.category_uuids,
                            is_available: record.is_available,
                          })}
                        >
                          <HugeiconsIcon icon={Edit02Icon} strokeWidth={1.8} className="size-4" />
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="destructive"
                          className="rounded-xl"
                          onClick={() => record && handleDelete({
                            uuid: record.uuid,
                            first_name: record.first_name,
                            last_name: record.last_name,
                            email: record.email,
                            phone: record.phone,
                            password: "",
                            license_number: record.license_number,
                            category_uuids: record.category_uuids,
                            is_available: record.is_available,
                          })}
                        >
                          <HugeiconsIcon icon={Delete02Icon} strokeWidth={1.8} className="size-4" />
                        </Button>
                        {record ? (
                          <DoctorScheduleManager doctor={record} />
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
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
              <Label>{t("nav.departments")}</Label>
              <p className="text-xs text-muted-foreground">
                {t("adminDoctors.departmentHelp")}
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {illnessCategories.map((category) => {
                  const selected = form.category_uuids.includes(category.uuid)
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
                  )
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

      <Sheet open={viewEditMode !== null} onOpenChange={(open) => !open && closeViewEditSheet()}>
        <SheetContent side="right" className="w-full sm:max-w-xl">
          <SheetHeader className="border-b border-sidebar-border">
            <SheetTitle>
              {viewEditMode === "view" ? t("adminDoctors.details") : t("adminDoctors.edit")}
            </SheetTitle>
            <SheetDescription>
              {viewEditMode === "view"
                ? t("adminDoctors.review")
                : t("adminDoctors.update")}
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 space-y-5 overflow-y-auto p-6">
            <div className="space-y-2">
              <Label htmlFor="view-uuid">{t("adminDoctors.id")}</Label>
              <Input id="view-uuid" value={editForm.license_number ? editForm.license_number : ""} disabled />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-first_name">{t("adminDoctors.firstName")}</Label>
                <Input
                  id="edit-first_name"
                  value={editForm.first_name}
                  disabled={viewEditMode === "view"}
                  onChange={(event) =>
                    handleEditDoctorFieldChange("first_name", event.target.value)
                  }
                />
                {editErrors.first_name && (
                  <p className="text-sm text-red-500">{editErrors.first_name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-last_name">{t("adminDoctors.lastName")}</Label>
                <Input
                  id="edit-last_name"
                  value={editForm.last_name}
                  disabled={viewEditMode === "view"}
                  onChange={(event) =>
                    handleEditDoctorFieldChange("last_name", event.target.value)
                  }
                />
                {editErrors.last_name && (
                  <p className="text-sm text-red-500">{editErrors.last_name}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">{t("adminDoctors.email")}</Label>
              <Input
                id="edit-email"
                type="email"
                value={editForm.email}
                disabled={viewEditMode === "view"}
                onChange={(event) =>
                  handleEditDoctorFieldChange("email", event.target.value)
                }
              />
              {editErrors.email && (
                <p className="text-sm text-red-500">{editErrors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-phone">{t("adminDoctors.phone")}</Label>
              <Input
                id="edit-phone"
                value={editForm.phone}
                disabled={viewEditMode === "view"}
                onChange={(event) =>
                  handleEditDoctorFieldChange("phone", event.target.value)
                }
              />
              {editErrors.phone && (
                <p className="text-sm text-red-500">{editErrors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-license_number">{t("adminDoctors.licenseNumber")}</Label>
              <Input
                id="edit-license_number"
                value={editForm.license_number}
                disabled={viewEditMode === "view"}
                onChange={(event) =>
                  handleEditDoctorFieldChange("license_number", event.target.value)
                }
              />
              {editErrors.license_number && (
                <p className="text-sm text-red-500">{editErrors.license_number}</p>
              )}
            </div>

            {viewEditMode === "edit" && (
              <div className="space-y-2">
                <Label>{t("nav.departments")}</Label>
                <p className="text-xs text-muted-foreground">
                {t("adminDoctors.departmentHelp")}
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {illnessCategories.map((category) => {
                    const selected = editForm.category_uuids.includes(category.uuid)
                    return (
                      <button
                        key={category.uuid}
                        type="button"
                        onClick={() =>
                          handleEditDoctorFieldChange(
                            "category_uuids",
                            selected
                              ? editForm.category_uuids.filter(
                                  (uuid) => uuid !== category.uuid,
                                )
                              : [...editForm.category_uuids, category.uuid],
                          )
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
                    )
                  })}
                </div>
              </div>
            )}

            {viewEditMode === "edit" && (
              <div className="flex items-center justify-between rounded-3xl border border-sidebar-border bg-muted/20 p-4">
                <div>
                  <p className="text-sm font-medium">{t("doctors.availability")}</p>
                  <p className="text-xs text-muted-foreground">
                    {editForm.is_available ? t("adminDoctors.available") : t("adminDoctors.unavailable")}
                  </p>
                </div>
                <Switch
                  checked={editForm.is_available}
                  onCheckedChange={(checked) =>
                    handleEditDoctorFieldChange("is_available", checked)
                  }
                />
              </div>
            )}
          </div>

          <SheetFooter className="flex flex-col-reverse items-stretch justify-between border-t border-sidebar-border sm:flex-row sm:items-center">
            <Button variant="outline" onClick={closeViewEditSheet}>
              {t("adminDoctors.close")}
            </Button>
            {viewEditMode === "edit" && (
              <Button onClick={handleSaveEdit} disabled={editSubmitting}>
                {editSubmitting ? t("adminDoctors.saving") : t("adminDoctors.saveChanges")}
              </Button>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && closeDeletePopup()}
      >
        <SheetContent side="bottom" className="mx-auto my-auto w-full rounded-t-4xl sm:max-w-xl">
          <SheetHeader className="border-b border-sidebar-border">
            <SheetTitle>{t("adminDoctors.deleteDoctor")}</SheetTitle>
            <SheetDescription>
              {t("adminDoctors.deleteDescription")}
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 p-6">
            <div className="rounded-3xl border border-rose-200 bg-rose-50/70 p-4 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">
              {deleteTarget ? (
                <p>{t("adminDoctors.aboutToDelete", {
                  name: `${deleteTarget.first_name} ${deleteTarget.last_name}`,
                  license: deleteTarget.license_number,
                })}</p>
              ) : null}
            </div>
            <p className="text-sm text-muted-foreground">
              {t("adminDoctors.keepRecord")}
            </p>
          </div>
          <SheetFooter className="border-t border-sidebar-border">
            <Button variant="outline" onClick={closeDeletePopup}>
              {t("adminDoctors.cancel")}
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              <HugeiconsIcon icon={Delete02Icon} strokeWidth={1.8} />
              {t("adminDoctors.delete")}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
