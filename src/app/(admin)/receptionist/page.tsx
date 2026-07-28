"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  Mail01Icon,
  PlusSignIcon,
  Search01Icon,
  Delete02Icon,
  Edit02Icon,
  ViewIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { toast } from "react-toastify"
import { useAdminStore } from "@/store/admin/admin.store"
import { useAppointmentStore } from "@/store/appointments/appointment.store"
import { PasswordInput } from "@/components/password-input"
import { Switch } from "@/components/ui/switch"
import { filterAppointmentsForQueue } from "@/lib/appointment-queues"
import { useTranslation } from "@/lib/i18n"
import { getBackendFieldErrors } from "@/lib/backend-errors"

type FormErrors = {
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
  password?: string
}

type ReceptionistRow = {
  uuid: string
  first_name: string
  last_name: string
  email: string
  phone: string
  is_active: boolean
}

const emptyReceptionistForm = {
  uuid: "",
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  password: "",
  is_active: true,
}

type SheetMode = "view" | "edit" | null

export default function ReceptionistPage() {
  const { t } = useTranslation()
  const { overview, users, fetchOverview, fetchUsers, createUser, updateUser, deleteUser } = useAdminStore()
  const { appointments, initialize } = useAppointmentStore()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [form, setForm] = useState(emptyReceptionistForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [search, setSearch] = useState("")
  const [sheetMode, setSheetMode] = useState<SheetMode>(null)
  const [activeUser, setActiveUser] = useState<ReceptionistRow | null>(null)
  const [editForm, setEditForm] = useState<ReceptionistRow>({
    uuid: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    is_active: true,
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [createErrors, setCreateErrors] = useState<FormErrors>({})
  const [editSubmitting, setEditSubmitting] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<ReceptionistRow | null>(null)

  useEffect(() => {
    void fetchOverview()
    void fetchUsers({ role: "receptionist" })
    void initialize()
  }, [fetchOverview, fetchUsers, initialize])

  const receptionists = useMemo(
    () =>
      users.filter((user) =>
        [user.full_name, user.first_name, user.last_name, user.email, user.phone]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(search.trim().toLowerCase())
      ),
    [users, search]
  )

  const isFormValid =
    form.first_name.trim() &&
    form.last_name.trim() &&
    form.email.trim() &&
    form.phone.trim() &&
    form.password.trim()

  async function handleCreateReceptionist() {
    if (!isFormValid || isSubmitting) {
      return
    }

    setIsSubmitting(true)
    setCreateErrors({})

    try {
      await createUser({
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        role: "receptionist",
        is_active: true,
      })
      toast.success(t("i18nAudit.receptionistManagement.added"))
      setForm(emptyReceptionistForm)
      setCreateErrors({})
      setSheetOpen(false)
    } catch (error: unknown) {
      const backendErrors = getBackendFieldErrors(error, [
        "first_name",
        "last_name",
        "email",
        "phone",
        "password",
      ])
      if (Object.keys(backendErrors).length > 0) {
        setCreateErrors(backendErrors)
      } else {
        toast.error(t("i18nAudit.receptionistManagement.addFailed"))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleView = (user: ReceptionistRow) => {
    setActiveUser(user)
    setEditForm({
      uuid: user.uuid,
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      email: user.email || "",
      phone: user.phone || "",
      is_active: user.is_active,
    })
    setSheetMode("view")
  }

  const handleEdit = (user: ReceptionistRow) => {
    setActiveUser(user)
    setEditForm({
      uuid: user.uuid,
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      email: user.email || "",
      phone: user.phone || "",
      is_active: user.is_active,
    })
    setErrors({})
    setSheetMode("edit")
  }

  const handleDelete = (user: ReceptionistRow) => {
    setDeleteTarget(user)
  }

  function closeSheet() {
    setSheetMode(null)
    setActiveUser(null)
    setEditForm({
      uuid: "",
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      is_active: true,
    })
    setErrors({})
  }

  function closeDeletePopup() {
    setDeleteTarget(null)
  }

  async function confirmDelete() {
    if (!deleteTarget) {
      return
    }

    try {
      await deleteUser(deleteTarget.uuid)
      toast.success(t("i18nAudit.receptionistManagement.deleted"))
      if (activeUser?.uuid === deleteTarget.uuid) {
        closeSheet()
      }
      closeDeletePopup()
    } catch {
      toast.error(t("i18nAudit.receptionistManagement.deleteFailed"))
      closeDeletePopup()
    }
  }

  async function handleSaveEdit() {
    if (!activeUser) {
      return
    }

    setEditSubmitting(true)
    setErrors({})

    try {
      await updateUser(activeUser.uuid, {
        first_name: editForm.first_name,
        last_name: editForm.last_name,
        email: editForm.email,
        phone: editForm.phone,
        is_active: editForm.is_active,
      })
      toast.success(t("i18nAudit.receptionistManagement.updated"))
      closeSheet()
    } catch (error: unknown) {
      const backendErrors = getBackendFieldErrors(error, [
        "first_name",
        "last_name",
        "email",
        "phone",
      ])
      if (Object.keys(backendErrors).length > 0) {
        setErrors(backendErrors)
      } else {
        toast.error(t("i18nAudit.receptionistManagement.updateFailed"))
      }
    } finally {
      setEditSubmitting(false)
    }
  }

  return (
    <div className="w-full space-y-6 p-4 md:p-6">
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-semibold">{t("i18nAudit.receptionistManagement.title")}</h1>
        <p className="text-sm text-muted-foreground">
          {t("i18nAudit.receptionistManagement.description")}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-4xl border border-sidebar-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">{t("i18nAudit.receptionistManagement.todaysCheckIns")}</p>
          <p className="mt-2 text-3xl font-semibold">{overview?.approved_appointments ?? 0}</p>
        </div>
        <div className="rounded-4xl border border-sidebar-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">{t("i18nAudit.receptionistManagement.pendingConfirmations")}</p>
          <p className="mt-2 text-3xl font-semibold">{overview?.pending_appointments ?? 0}</p>
        </div>
        <div className="rounded-4xl border border-sidebar-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">{t("i18nAudit.receptionistManagement.walkInsToday")}</p>
          <p className="mt-2 text-3xl font-semibold">{filterAppointmentsForQueue(appointments, "receptionist", "awaiting-payment").length}</p>
        </div>
        <div className="rounded-4xl border border-sidebar-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">{t("i18nAudit.receptionistManagement.openDesks")}</p>
          <p className="mt-2 text-3xl font-semibold">{receptionists.length}</p>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
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
            placeholder={t("i18nAudit.receptionistManagement.search")}
          />
        </div>
        <Button className="rounded-md" onClick={() => setSheetOpen(true)}>
          <HugeiconsIcon icon={PlusSignIcon} strokeWidth={1.8} />
          {t("i18nAudit.receptionistManagement.add")}
        </Button>
      </div>

      <div className="overflow-hidden rounded-4xl border border-sidebar-border bg-card shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-12">#</TableHead>
              <TableHead>{t("common.name")}</TableHead>
              <TableHead>{t("common.email")}</TableHead>
              <TableHead>{t("common.phone")}</TableHead>
              <TableHead>{t("i18nAudit.receptionistManagement.desk")}</TableHead>
              <TableHead>{t("i18nAudit.receptionistManagement.shift")}</TableHead>
              <TableHead>{t("i18nAudit.receptionistManagement.patientsHandled")}</TableHead>
              <TableHead className="text-right">{t("common.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {receptionists.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  {t("i18nAudit.receptionistManagement.noneFound")}
                </TableCell>
              </TableRow>
            ) : (
              receptionists.map((user, index) => (
                <TableRow key={user.uuid}>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {index + 1}
                  </TableCell>
                  <TableCell className="font-medium">
                    {user.full_name || user.email}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <HugeiconsIcon icon={Mail01Icon} strokeWidth={1.8} className="size-4" />
                      {user.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <HugeiconsIcon icon={CallIcon} strokeWidth={1.8} className="size-4" />
                      {user.phone}
                    </div>
                  </TableCell>
                  <TableCell>{t("i18nAudit.receptionistManagement.frontDesk", { desk: String.fromCharCode(65 + index) })}</TableCell>
                  <TableCell>{t("i18nAudit.receptionistManagement.activeShift")}</TableCell>
                  <TableCell>
                    {filterAppointmentsForQueue(appointments, "receptionist", "today").length}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="icon-sm"
                        variant="outline"
                        className="rounded-xl"
                        onClick={() => handleView(user)}
                      >
                        <HugeiconsIcon icon={ViewIcon} strokeWidth={1.8} className="size-4" />
                      </Button>
                      <Button
                        size="icon-sm"
                        variant="outline"
                        className="rounded-xl"
                        onClick={() => handleEdit(user)}
                      >
                        <HugeiconsIcon icon={Edit02Icon} strokeWidth={1.8} className="size-4" />
                      </Button>
                      <Button
                        size="icon-sm"
                        variant="destructive"
                        className="rounded-xl"
                        onClick={() => handleDelete(user)}
                      >
                        <HugeiconsIcon icon={Delete02Icon} strokeWidth={1.8} className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-2xl">
          <SheetHeader className="border-b border-sidebar-border">
            <SheetTitle>{t("i18nAudit.receptionistManagement.add")}</SheetTitle>
            <SheetDescription>{t("i18nAudit.receptionistManagement.createDescription")}</SheetDescription>
          </SheetHeader>

            <div className="space-y-4 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("i18nAudit.receptionistManagement.firstName")}</label>
                  <Input
                    value={form.first_name}
                    onChange={(event) => {
                      const value = event.target.value
                      setForm((current) => ({ ...current, first_name: value }))
                      if (createErrors.first_name) {
                        setCreateErrors((prev) => ({ ...prev, first_name: undefined }))
                      }
                    }}
                    className={createErrors.first_name ? "border-red-500" : ""}
                  />
                  {createErrors.first_name && (
                    <p className="text-sm text-red-500">{createErrors.first_name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("i18nAudit.receptionistManagement.lastName")}</label>
                  <Input
                    value={form.last_name}
                    onChange={(event) => {
                      const value = event.target.value
                      setForm((current) => ({ ...current, last_name: value }))
                      if (createErrors.last_name) {
                        setCreateErrors((prev) => ({ ...prev, last_name: undefined }))
                      }
                    }}
                    className={createErrors.last_name ? "border-red-500" : ""}
                  />
                  {createErrors.last_name && (
                    <p className="text-sm text-red-500">{createErrors.last_name}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("common.email")}</label>
                  <Input
                    value={form.email}
                    onChange={(event) => {
                      const value = event.target.value
                      setForm((current) => ({ ...current, email: value }))
                      if (createErrors.email) {
                        setCreateErrors((prev) => ({ ...prev, email: undefined }))
                      }
                    }}
                    className={createErrors.email ? "border-red-500" : ""}
                  />
                  {createErrors.email && (
                    <p className="text-sm text-red-500">{createErrors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("common.phone")}</label>
                  <Input
                    value={form.phone}
                    onChange={(event) => {
                      const value = event.target.value
                      setForm((current) => ({ ...current, phone: value }))
                      if (createErrors.phone) {
                        setCreateErrors((prev) => ({ ...prev, phone: undefined }))
                      }
                    }}
                    className={createErrors.phone ? "border-red-500" : ""}
                  />
                  {createErrors.phone && (
                    <p className="text-sm text-red-500">{createErrors.phone}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t("i18nAudit.receptionistManagement.initialPassword")}</Label>
                <PasswordInput
                  id="password"
                  placeholder={t("i18nAudit.receptionistManagement.minimumPassword")}
                  className={`rounded-xl h-11 ${createErrors.password ? "border-red-500" : ""}`}
                  required
                  value={form.password}
                  onChange={(event) => {
                    const value = event.target.value
                    setForm((current) => ({ ...current, password: value }))
                    if (createErrors.password) {
                      setCreateErrors((prev) => ({ ...prev, password: undefined }))
                    }
                  }}
                />
                {createErrors.password && (
                  <p className="text-sm text-red-500">{createErrors.password}</p>
                )}
                <p className="text-[10px] text-muted-foreground mt-1">
                  {t("i18nAudit.receptionistManagement.passwordHelp")}
                </p>
              </div>
            </div>

          <SheetFooter className="border-t border-sidebar-border">
            <Button variant="outline" onClick={() => setSheetOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button
              onClick={handleCreateReceptionist}
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? t("profile.saving") : t("i18nAudit.receptionistManagement.save")}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet open={sheetMode !== null} onOpenChange={(open) => !open && closeSheet()}>
        <SheetContent side="right" className="w-full sm:max-w-xl">
          <SheetHeader className="border-b border-sidebar-border">
            <SheetTitle>
              {sheetMode === "view" ? t("i18nAudit.receptionistManagement.details") : t("i18nAudit.receptionistManagement.edit")}
            </SheetTitle>
            <SheetDescription>
              {sheetMode === "view"
                ? t("i18nAudit.receptionistManagement.review")
                : t("i18nAudit.receptionistManagement.update")}
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 space-y-5 overflow-y-auto p-6">
            <div className="space-y-2">
              <Label htmlFor="uuid">{t("adminUsers.id")}</Label>
              <Input id="uuid" value={editForm.uuid} disabled />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="first_name">{t("i18nAudit.receptionistManagement.firstName")}</Label>
                <Input
                  id="first_name"
                  value={editForm.first_name}
                  disabled={sheetMode === "view"}
                  onChange={(event) =>
                    setEditForm((current) => ({ ...current, first_name: event.target.value }))
                  }
                />
                {errors.first_name && (
                  <p className="text-sm text-red-500">{errors.first_name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">{t("i18nAudit.receptionistManagement.lastName")}</Label>
                <Input
                  id="last_name"
                  value={editForm.last_name}
                  disabled={sheetMode === "view"}
                  onChange={(event) =>
                    setEditForm((current) => ({ ...current, last_name: event.target.value }))
                  }
                />
                {errors.last_name && (
                  <p className="text-sm text-red-500">{errors.last_name}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t("common.email")}</Label>
              <Input
                id="email"
                type="email"
                value={editForm.email}
                disabled={sheetMode === "view"}
                onChange={(event) =>
                  setEditForm((current) => ({ ...current, email: event.target.value }))
                }
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">{t("common.phone")}</Label>
              <Input
                id="phone"
                value={editForm.phone}
                disabled={sheetMode === "view"}
                onChange={(event) =>
                  setEditForm((current) => ({ ...current, phone: event.target.value }))
                }
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone}</p>
              )}
            </div>

            {sheetMode === "edit" && (
              <div className="flex items-center justify-between rounded-3xl border border-sidebar-border bg-muted/20 p-4">
                <div>
                  <p className="text-sm font-medium">{t("common.status")}</p>
                  <p className="text-xs text-muted-foreground">
                    {editForm.is_active ? t("adminPatients.active") : t("adminPatients.inactive")}
                  </p>
                </div>
                <Switch
                  checked={editForm.is_active}
                  onCheckedChange={(checked) =>
                    setEditForm((current) => ({ ...current, is_active: checked }))
                  }
                />
              </div>
            )}
          </div>

          <SheetFooter className="flex flex-col-reverse items-stretch justify-between border-t border-sidebar-border sm:flex-row sm:items-center">
            <Button variant="outline" onClick={closeSheet}>
              {t("common.close")}
            </Button>
            {sheetMode === "edit" && (
              <Button onClick={handleSaveEdit} disabled={editSubmitting}>
                {editSubmitting ? t("profile.saving") : t("adminPatients.saveChanges")}
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
            <SheetTitle>{t("i18nAudit.receptionistManagement.deleteTitle")}</SheetTitle>
            <SheetDescription>
              {t("i18nAudit.receptionistManagement.deleteDescription")}
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 p-6">
            <div className="rounded-3xl border border-rose-200 bg-rose-50/70 p-4 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">
              {deleteTarget ? (
                <p>{t("i18nAudit.receptionistManagement.aboutToDelete", {
                  name: `${deleteTarget.first_name} ${deleteTarget.last_name}`,
                  id: deleteTarget.uuid,
                })}</p>
              ) : null}
            </div>
            <p className="text-sm text-muted-foreground">
              {t("i18nAudit.receptionistManagement.keepRecord")}
            </p>
          </div>
          <SheetFooter className="border-t border-sidebar-border">
            <Button variant="outline" onClick={closeDeletePopup}>
              {t("common.cancel")}
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              <HugeiconsIcon icon={Delete02Icon} strokeWidth={1.8} />
              {t("common.delete")}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
