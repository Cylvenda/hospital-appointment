"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { User } from "@/store/auth/auth.types"
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Delete02Icon,
  FilterIcon,
  PlusSignIcon,
  Search01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { getColumns } from "./column"
import { patientTableData } from "./table-data"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="overflow-hidden rounded-4xl border border-sidebar-border bg-card shadow-sm">
      <Table>
        <TableHeader className="bg-muted/50">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No patients found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

const PAGE_SIZE = 15
const roleOptions = ["Admin", "Patient", "Doctor", "Receptionist"] as const
const emptyPatient: User = {
  uuid: "",
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  username: "",
  role: "Patient",
  is_active: true,
  is_admin: false,
  is_staff: false,
}

type SheetMode = "create" | "view" | "edit" | null

export default function PatientsPage() {
  const [patients, setPatients] = React.useState<User[]>(patientTableData)
  const [search, setSearch] = React.useState("")
  const [currentPage, setCurrentPage] = React.useState(1)
  const [sheetMode, setSheetMode] = React.useState<SheetMode>(null)
  const [activePatient, setActivePatient] = React.useState<User | null>(null)
  const [formPatient, setFormPatient] = React.useState<User>(emptyPatient)
  const [deleteTarget, setDeleteTarget] = React.useState<User | null>(null)

  const filteredPatients = React.useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) {
      return patients
    }

    return patients.filter((patient: User) => {
      const fullName = `${patient.first_name} ${patient.last_name}`.toLowerCase()

      return (
        fullName.includes(query) ||
        patient.email.toLowerCase().includes(query) ||
        patient.phone.toLowerCase().includes(query) ||
        patient.username.toLowerCase().includes(query)
      )
    })
  }, [patients, search])

  const totalPages = Math.max(1, Math.ceil(filteredPatients.length / PAGE_SIZE))

  React.useEffect(() => {
    setCurrentPage(1)
  }, [search])

  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const paginatedPatients = React.useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredPatients.slice(start, start + PAGE_SIZE)
  }, [currentPage, filteredPatients])
  const pageStart = filteredPatients.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1
  const pageEnd = Math.min(currentPage * PAGE_SIZE, filteredPatients.length)

  const activePatients = patients.filter((patient) => patient.is_active).length
  const sheetOpen = sheetMode !== null

  const handleView = React.useCallback((patient: User) => {
    setActivePatient(patient)
    setFormPatient({ ...patient })
    setSheetMode("view")
  }, [])

  const handleEdit = React.useCallback((patient: User) => {
    setActivePatient(patient)
    setFormPatient({ ...patient })
    setSheetMode("edit")
  }, [])

  const handleDelete = React.useCallback((patient: User) => {
    setDeleteTarget(patient)
  }, [])

  const handleCreate = React.useCallback(() => {
    setActivePatient(null)
    setFormPatient(emptyPatient)
    setSheetMode("create")
  }, [])

  const columns = React.useMemo(
    () =>
      getColumns({
        onView: handleView,
        onEdit: handleEdit,
        onDelete: handleDelete,
      }),
    [handleDelete, handleEdit, handleView]
  )

  function closeSheet() {
    setSheetMode(null)
    setActivePatient(null)
    setFormPatient(emptyPatient)
  }

  function closeDeletePopup() {
    setDeleteTarget(null)
  }

  function updateFormField<K extends keyof User>(key: K, value: User[K]) {
    setFormPatient((current) => ({ ...current, [key]: value }))
  }

  function getRoleFlags(role: User["role"]) {
    const normalizedRole = role.toLowerCase()

    return {
      is_admin: normalizedRole === "admin",
      is_staff: normalizedRole === "doctor" || normalizedRole === "receptionist",
    }
  }

  function handleSavePatient() {
    const normalizedUsername =
      formPatient.username.trim() ||
      `${formPatient.first_name}.${formPatient.last_name}`
        .toLowerCase()
        .replace(/\s+/g, ".")
    const roleFlags = getRoleFlags(formPatient.role)

    if (sheetMode === "create") {
      const newPatient: User = {
        ...formPatient,
        uuid: `usr_${Date.now()}`,
        username: normalizedUsername,
        ...roleFlags,
      }

      setPatients((current) => [newPatient, ...current])
      setActivePatient(newPatient)
      closeSheet()
      return
    }

    if (sheetMode === "edit" && activePatient) {
      const updatedPatient: User = {
        ...formPatient,
        uuid: activePatient.uuid,
        username: normalizedUsername,
        ...roleFlags,
      }

      setPatients((current) =>
        current.map((patient) =>
          patient.uuid === activePatient.uuid ? updatedPatient : patient
        )
      )
      setActivePatient(updatedPatient)
      closeSheet()
    }
  }

  function confirmDeletePatient() {
    if (!deleteTarget) {
      return
    }

    setPatients((current) => current.filter((item) => item.uuid !== deleteTarget.uuid))
    setActivePatient((current) =>
      current?.uuid === deleteTarget.uuid ? null : current
    )
    if (
      (sheetMode === "view" || sheetMode === "edit") &&
      activePatient?.uuid === deleteTarget.uuid
    ) {
      closeSheet()
    }
    closeDeletePopup()
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="space-y-1">
          <h1 className="font-heading text-2xl font-semibold">Patients List</h1>
          <p className="text-sm text-muted-foreground">
            Review registered patients, account status, contact details, and actions.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative min-w-0 sm:w-80">
            <HugeiconsIcon
              icon={Search01Icon}
              strokeWidth={1.8}
              className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search patient, email, phone..."
              className="h-11 rounded-2xl border-2 border-sidebar-border pr-4 pl-11"
            />
          </div>
          <Button variant="outline" size="lg" className="rounded-2xl">
            <HugeiconsIcon icon={FilterIcon} strokeWidth={1.8} />
            Filter
          </Button>
          <Button size="lg" className="rounded-2xl" onClick={handleCreate}>
            <HugeiconsIcon icon={PlusSignIcon} strokeWidth={1.8} />
            Add Patient
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-4xl border border-sidebar-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Patients</p>
          <p className="mt-2 text-3xl font-semibold">{patients.length}</p>
        </div>
        <div className="rounded-4xl border border-sidebar-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Active Accounts</p>
          <p className="mt-2 text-3xl font-semibold">{activePatients}</p>
        </div>
        <div className="rounded-4xl border border-sidebar-border bg-card p-5 shadow-sm">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <HugeiconsIcon icon={UserGroupIcon} strokeWidth={1.8} className="size-4" />
            Search Results
          </p>
          <p className="mt-2 text-3xl font-semibold">{filteredPatients.length}</p>
        </div>
      </div>

      <DataTable columns={columns} data={paginatedPatients} />

      <div className="flex flex-col justify-between gap-3 rounded-4xl border border-sidebar-border bg-card p-4 shadow-sm sm:flex-row sm:items-center">
        <div className="space-y-1 text-sm text-muted-foreground">
          <p>
            Showing {pageStart}-{pageEnd} of {filteredPatients.length} patients
          </p>
          <p>
            Page {currentPage} of {totalPages}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={currentPage === 1}
            className="rounded-2xl"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={1.8} />
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
            disabled={currentPage === totalPages}
            className="rounded-2xl"
          >
            Next
            <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={1.8} />
          </Button>
        </div>
      </div>

      <Sheet open={sheetOpen} onOpenChange={(open) => (!open ? closeSheet() : undefined)}>
        <SheetContent side="right" className="w-full sm:max-w-3xl">
          <SheetHeader className="border-b border-sidebar-border">
            <SheetTitle>
              {sheetMode === "create"
                ? "Add Patient"
                : sheetMode === "edit"
                  ? "Edit Patient"
                  : "Patient Details"}
            </SheetTitle>
            <SheetDescription>
              {sheetMode === "view"
                ? "Review the selected patient's profile information."
                : "Fill in the patient details and save your changes."}
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 space-y-5 overflow-y-auto p-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Patient ID</label>
              <Input value={formPatient.uuid} disabled />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">First name</label>
                <Input
                  value={formPatient.first_name}
                  disabled={sheetMode === "view"}
                  onChange={(event) => updateFormField("first_name", event.target.value)}
                  placeholder="First name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Last name</label>
                <Input
                  value={formPatient.last_name}
                  disabled={sheetMode === "view"}
                  onChange={(event) => updateFormField("last_name", event.target.value)}
                  placeholder="Last name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                value={formPatient.email}
                disabled={sheetMode === "view"}
                onChange={(event) => updateFormField("email", event.target.value)}
                placeholder="Email address"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone number</label>
                <Input
                  value={formPatient.phone}
                  disabled={sheetMode === "view"}
                  onChange={(event) => updateFormField("phone", event.target.value)}
                  placeholder="Phone number"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Username</label>
                <Input
                  value={formPatient.username}
                  disabled={sheetMode === "view"}
                  onChange={(event) => updateFormField("username", event.target.value)}
                  placeholder="Username"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <Select
                  value={formPatient.role}
                  disabled={sheetMode === "view"}
                  onValueChange={(value) => updateFormField("role", value)}
                >
                  <SelectTrigger className="w-full rounded-2xl border border-input bg-background">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select
                  value={formPatient.is_active ? "active" : "inactive"}
                  disabled={sheetMode === "view"}
                  onChange={(event) =>
                    updateFormField("is_active", event.target.value === "active")
                  }
                  className="flex h-9 w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm outline-none"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <SheetFooter className="border-t border-sidebar-border flex flex-row justify-between">
            <Button variant="outline" onClick={closeSheet}>
              Close
            </Button>
            {sheetMode !== "view" && (
              <Button onClick={handleSavePatient} >
                {sheetMode === "create" ? "Create Patient" : "Save Changes"}
              </Button>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet
        open={deleteTarget !== null}
        onOpenChange={(open) => (!open ? closeDeletePopup() : undefined)}
      >
        <SheetContent side="bottom" className="mx-auto my-auto w-full  rounded-t-4xl sm:max-w-xl">
          <SheetHeader className="border-b border-sidebar-border">
            <SheetTitle>Delete Patient</SheetTitle>
            <SheetDescription>
              This action will remove the patient from the current list.
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
              ) : null}Neema
            </div>
            <p className="text-sm text-muted-foreground">
              You can close this popup if you want to keep the patient record.
            </p>
          </div>
          <SheetFooter className="border-t border-sidebar-border">
            <Button variant="outline" onClick={closeDeletePopup}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeletePatient}>
              <HugeiconsIcon icon={Delete02Icon} strokeWidth={1.8} />
              Delete Patient
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
