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
  FilterIcon,
  PlusSignIcon,
  Search01Icon,
  Mail01Icon,
  CallIcon,
  UserIcon,
  CheckmarkCircle02Icon,
  Shield01Icon,
  ViewIcon,
  Edit02Icon,
  Delete02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"
import { Switch } from "@/components/ui/switch"
import { useAdminStore } from "@/store/admin/admin.store"
import { toast } from "react-toastify"
import { getBackendFieldErrors } from "@/lib/backend-errors"
import { Label } from "@/components/ui/label"

type FormErrors = {
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
}

const emptyUserForm = {
  uuid: "",
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  role: "user",
  is_active: true,
}

type SheetMode = "view" | "edit" | null

function roleClasses(role: string) {
  if (role === "admin") {
    return "bg-purple-50 text-purple-700 ring-1 ring-purple-100 dark:bg-purple-500/15 dark:text-purple-300 dark:ring-purple-500/20"
  }
  if (role === "doctor") {
    return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/20"
  }
  if (role === "receptionist") {
    return "bg-blue-50 text-blue-700 ring-1 ring-blue-100 dark:bg-blue-500/15 dark:text-blue-300 dark:ring-blue-500/20"
  }
  if (role === "lab_tech") {
    return "bg-amber-50 text-amber-700 ring-1 ring-amber-100 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/20"
  }
  return "bg-muted text-muted-foreground ring-1 ring-border"
}

export default function UsersPage() {
  const { t } = useTranslation()
  const { users: userDirectory, fetchUsers, updateUser, deleteUser } = useAdminStore()
  const [search, setSearch] = useState("")
  const [sheetMode, setSheetMode] = useState<SheetMode>(null)
  const [activeUser, setActiveUser] = useState<(typeof emptyUserForm) | null>(null)
  const [form, setForm] = useState(emptyUserForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<(typeof emptyUserForm) | null>(null)

  useEffect(() => {
    void fetchUsers()
  }, [fetchUsers])

  const users = useMemo(
    () =>
      userDirectory
        .filter((user) =>
          [user.full_name, user.first_name, user.last_name, user.email, user.phone, user.role, user.username]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(search.trim().toLowerCase())
        )
        .map((user) => ({
          uuid: user.uuid,
          first_name: user.first_name,
          last_name: user.last_name,
          id: user.uuid.slice(0, 8).toUpperCase(),
          name: user.full_name || `${user.first_name} ${user.last_name}`,
          email: user.email,
          phone: user.phone,
          role: user.role,
          is_active: user.is_active,
          isActive: user.is_active,
        })),
    [userDirectory, search]
  )

  const handleView = (user: (typeof emptyUserForm)) => {
    setActiveUser(user)
    setForm({
      ...user,
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      email: user.email || "",
      phone: user.phone || "",
    })
    setSheetMode("view")
  }

  const handleEdit = (user: (typeof emptyUserForm)) => {
    setActiveUser(user)
    setForm({
      ...user,
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      email: user.email || "",
      phone: user.phone || "",
    })
    setErrors({})
    setSheetMode("edit")
  }

  const handleDelete = (user: (typeof emptyUserForm)) => {
    setDeleteTarget(user)
  }

  function closeSheet() {
    setSheetMode(null)
    setActiveUser(null)
    setForm(emptyUserForm)
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
      toast.success("User deleted successfully")
      if (activeUser?.uuid === deleteTarget.uuid) {
        closeSheet()
      }
      closeDeletePopup()
    } catch {
      toast.error("Failed to delete user")
      closeDeletePopup()
    }
  }

  async function handleSaveEdit() {
    if (!activeUser) {
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      await updateUser(activeUser.uuid, {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone: form.phone,
        is_active: form.is_active,
      })
      toast.success("User updated successfully")
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
        toast.error("Failed to update user")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full space-y-6 p-4 md:p-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="space-y-1">
          <h1 className="font-heading text-2xl font-semibold">{t("adminUsers.users")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("adminUsers.usersDesc")}
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
              placeholder={t("adminUsers.searchUsersOrRoles")}
            />
          </div>
          <Button variant="outline" size="lg" className="rounded-md">
            <HugeiconsIcon icon={FilterIcon} strokeWidth={1.8} />
            {t("adminUsers.filter")}
          </Button>
          <Button size="lg" className="rounded-md" asChild>
            <Link href="/users/create">
              <HugeiconsIcon icon={PlusSignIcon} strokeWidth={1.8} />
              {t("adminUsers.addUser")}
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-4xl border border-sidebar-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">{t("adminUsers.totalUsers")}</p>
          <p className="mt-2 text-3xl font-semibold">{users.length}</p>
        </div>
        <div className="rounded-4xl border border-sidebar-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">{t("adminUsers.activeUsers")}</p>
          <p className="mt-2 text-3xl font-semibold">
            {users.filter((user) => user.isActive).length}
          </p>
        </div>
        <div className="rounded-4xl border border-sidebar-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">{t("adminUsers.inactiveUsers")}</p>
          <p className="mt-2 text-3xl font-semibold">
            {users.filter((user) => !user.isActive).length}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-4xl border border-sidebar-border bg-card shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-12">#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user, index) => (
                <TableRow key={user.uuid}>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {index + 1}
                  </TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <HugeiconsIcon icon={Mail01Icon} strokeWidth={1.8} className="size-4" />
                      {user.email || t("adminUsers.noEmail")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <HugeiconsIcon icon={CallIcon} strokeWidth={1.8} className="size-4" />
                      {user.phone || t("adminUsers.noPhone")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium capitalize ${roleClasses(user.role)}`}>
                      <HugeiconsIcon icon={UserIcon} strokeWidth={1.8} className="size-3.5" />
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    {user.isActive ? (
                      <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-100 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/20">
                        <HugeiconsIcon
                          icon={CheckmarkCircle02Icon}
                          strokeWidth={1.8}
                          className="size-3.5"
                        />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700 ring-1 ring-rose-100 dark:bg-rose-500/15 dark:text-rose-300 dark:ring-rose-500/20">
                        <HugeiconsIcon
                          icon={Shield01Icon}
                          strokeWidth={1.8}
                          className="size-3.5"
                        />
                        {t("adminUsers.inactive")}
                      </span>
                    )}
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

      <Sheet open={sheetMode !== null} onOpenChange={(open) => !open && closeSheet()}>
        <SheetContent side="right" className="w-full sm:max-w-xl">
          <SheetHeader className="border-b border-sidebar-border">
            <SheetTitle>
              {sheetMode === "view" ? "User Details" : "Edit User"}
            </SheetTitle>
            <SheetDescription>
              {sheetMode === "view"
                ? "Review user profile information."
                : "Update user account details."}
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 space-y-5 overflow-y-auto p-6">
            <div className="space-y-2">
              <Label htmlFor="uuid">ID</Label>
              <Input id="uuid" value={form.uuid} disabled />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  value={form.first_name}
                  disabled={sheetMode === "view"}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, first_name: event.target.value }))
                  }
                />
                {errors.first_name && (
                  <p className="text-sm text-red-500">{errors.first_name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={form.last_name}
                  disabled={sheetMode === "view"}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, last_name: event.target.value }))
                  }
                />
                {errors.last_name && (
                  <p className="text-sm text-red-500">{errors.last_name}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                disabled={sheetMode === "view"}
                onChange={(event) =>
                  setForm((current) => ({ ...current, email: event.target.value }))
                }
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={form.phone}
                disabled={sheetMode === "view"}
                onChange={(event) =>
                  setForm((current) => ({ ...current, phone: event.target.value }))
                }
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone}</p>
              )}
            </div>

            {sheetMode === "edit" && (
              <div className="flex items-center justify-between rounded-3xl border border-sidebar-border bg-muted/20 p-4">
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <p className="text-xs text-muted-foreground">
                    {form.is_active ? "Active" : "Inactive"}
                  </p>
                </div>
                <Switch
                  checked={form.is_active}
                  onCheckedChange={(checked) =>
                    setForm((current) => ({ ...current, is_active: checked }))
                  }
                />
              </div>
            )}
          </div>

          <SheetFooter className="border-t border-sidebar-border flex flex-row justify-between">
            <Button variant="outline" onClick={closeSheet}>
              Close
            </Button>
            {sheetMode === "edit" && (
              <Button onClick={handleSaveEdit} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
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
            <SheetTitle>Delete User</SheetTitle>
            <SheetDescription>
              This action cannot be undone. The user account will be permanently removed.
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 p-6">
            <div className="rounded-3xl border border-rose-200 bg-rose-50/70 p-4 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">
              {deleteTarget ? (
                <p>
                  You are about to delete{" "}
                  <span className="font-semibold">
                    {deleteTarget.first_name} {deleteTarget.last_name}
                  </span>{" "}
                  with ID <span className="font-mono">{deleteTarget.uuid}</span>.
                </p>
              ) : null}
            </div>
            <p className="text-sm text-muted-foreground">
              You can close this popup if you want to keep the record.
            </p>
          </div>
          <SheetFooter className="border-t border-sidebar-border">
            <Button variant="outline" onClick={closeDeletePopup}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              <HugeiconsIcon icon={Delete02Icon} strokeWidth={1.8} />
              Delete
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
