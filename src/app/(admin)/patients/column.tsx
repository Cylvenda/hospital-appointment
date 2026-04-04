"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { User } from "@/store/auth/auth.types"
import {
  CallIcon,
  CheckmarkCircle02Icon,
  Delete02Icon,
  Edit02Icon,
  Mail01Icon,
  Shield01Icon,
  UserIcon,
  ViewIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { ColumnDef } from "@tanstack/react-table"

function getInitials(firstName: string, lastName: string) {
  return `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase()
}

type ColumnActions = {
  onView: (patient: User) => void
  onEdit: (patient: User) => void
  onDelete: (patient: User) => void
}

export function getColumns({
  onView,
  onEdit,
  onDelete,
}: ColumnActions): ColumnDef<User>[] {
  return [
    {
      accessorKey: "uuid",
      header: "ID",
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground">
          {row.original.uuid}
        </span>
      ),
    },
    {
      accessorKey: "first_name",
      header: "Patient",
      cell: ({ row }) => {
        const patient = row.original

        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 rounded-2xl">
              <AvatarFallback className="rounded-2xl bg-primary/10 font-semibold text-primary">
                {getInitials(patient.first_name, patient.last_name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-medium text-foreground">
                {patient.first_name} {patient.last_name}
              </p>
              <p className="text-xs text-muted-foreground">@{patient.username}</p>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-muted-foreground">
          <HugeiconsIcon icon={Mail01Icon} strokeWidth={1.8} className="size-4" />
          <span>{row.original.email}</span>
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Phone Number",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-muted-foreground">
          <HugeiconsIcon icon={CallIcon} strokeWidth={1.8} className="size-4" />
          <span>{row.original.phone}</span>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <span className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          <HugeiconsIcon icon={UserIcon} strokeWidth={1.8} className="size-3.5" />
          {row.original.role}
        </span>
      ),
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) =>
        row.original.is_active ? (
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
            Inactive
          </span>
        ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const patient = row.original

        return (
          <div className="flex items-center gap-2">
            <Button
              size="icon-sm"
              variant="outline"
              className="rounded-xl"
              onClick={() => onView(patient)}
              aria-label={`View ${patient.first_name}`}
            >
              <HugeiconsIcon icon={ViewIcon} strokeWidth={1.8} className="size-4" />
            </Button>
            <Button
              size="icon-sm"
              variant="outline"
              className="rounded-xl"
              onClick={() => onEdit(patient)}
              aria-label={`Edit ${patient.first_name}`}
            >
              <HugeiconsIcon icon={Edit02Icon} strokeWidth={1.8} className="size-4" />
            </Button>
            <Button
              size="icon-sm"
              variant="destructive"
              className="rounded-xl"
              onClick={() => onDelete(patient)}
              aria-label={`Delete ${patient.first_name}`}
            >
              <HugeiconsIcon icon={Delete02Icon} strokeWidth={1.8} className="size-4" />
            </Button>
          </div>
        )
      },
    },
  ]
}
