"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  FilterIcon,
  PlusSignIcon,
  Search01Icon,
  Mail01Icon,
  CallIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { User } from "lucide-react"
import { useAdminStore } from "@/store/admin/admin.store"
import Link from "next/link"

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
  const { users: userDirectory, fetchUsers } = useAdminStore()
  const [search, setSearch] = useState("")

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
          id: user.uuid.slice(0, 8).toUpperCase(),
          name: user.full_name || `${user.first_name} ${user.last_name}`,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isActive: user.is_active,
        })),
    [userDirectory, search]
  )

  return (
    <div className="w-full space-y-6 p-4 md:p-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="space-y-1">
          <h1 className="font-heading text-2xl font-semibold">Users</h1>
          <p className="text-sm text-muted-foreground">
            Manage system users, roles, and access permissions.
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
              placeholder="Search users or roles..."
            />
          </div>
          <Button variant="outline" size="lg" className="rounded-md">
            <HugeiconsIcon icon={FilterIcon} strokeWidth={1.8} />
            Filter
          </Button>
          <Button size="lg" className="rounded-md" asChild>
            <Link href="/users/create">
              <HugeiconsIcon icon={PlusSignIcon} strokeWidth={1.8} />
              Add User
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-4xl border border-sidebar-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Users</p>
          <p className="mt-2 text-3xl font-semibold">{users.length}</p>
        </div>
        <div className="rounded-4xl border border-sidebar-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Active Users</p>
          <p className="mt-2 text-3xl font-semibold">
            {users.filter((user) => user.isActive).length}
          </p>
        </div>
        <div className="rounded-4xl border border-sidebar-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Inactive Users</p>
          <p className="mt-2 text-3xl font-semibold">
            {users.filter((user) => !user.isActive).length}
          </p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {users.map((user) => (
          <div
            key={user.id}
            className="rounded-4xl border border-sidebar-border bg-card p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <User size={24} />
                </div>
                <div className="space-y-1">
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
                  <p className="font-mono text-xs text-muted-foreground">{user.id}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${roleClasses(user.role)} capitalize`}>
                  {user.role}
                </span>
                {!user.isActive && (
                  <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700 ring-1 ring-red-100">
                    Inactive
                  </span>
                )}
              </div>
            </div>

            <div className="mt-5 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
              <p className="flex items-center gap-2">
                <HugeiconsIcon icon={Mail01Icon} strokeWidth={1.8} className="size-4" />
                {user.email || "No email"}
              </p>
              <p className="flex items-center gap-2">
                <HugeiconsIcon icon={CallIcon} strokeWidth={1.8} className="size-4" />
                {user.phone || "No phone"}
              </p>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Button className="rounded-md">View Details</Button>
              <Button variant="outline" className="rounded-md">
                Edit User
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
