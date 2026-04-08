import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  FilterIcon,
  Mail01Icon,
  Search01Icon,
  Shield01Icon,
  UserAccountIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

const users = [
  {
    id: "USR-001",
    name: "Amina Kassim",
    email: "amina.kassim@pams.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: "USR-002",
    name: "Janeth Paul",
    email: "janeth.paul@pams.com",
    role: "Receptionist",
    status: "Active",
  },
  {
    id: "USR-003",
    name: "Dr. Mary Njoroge",
    email: "mary.njoroge@pams.com",
    role: "Doctor",
    status: "Active",
  },
  {
    id: "USR-004",
    name: "Brayan Mlawa",
    email: "brayan.mlawa@pams.com",
    role: "Patient",
    status: "Inactive",
  },
  {
    id: "USR-005",
    name: "Kelvin Nyangasa",
    email: "kelvin.nyangasa@pams.com",
    role: "Receptionist",
    status: "Active",
  },
]

function roleClasses(role: string) {
  if (role === "Admin") {
    return "bg-primary/10 text-primary"
  }

  if (role === "Doctor") {
    return "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
  }

  if (role === "Receptionist") {
    return "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
  }

  return "bg-muted text-muted-foreground"
}

export default function UsersPage() {
  return (
    <div className="w-full space-y-6 p-4 md:p-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="space-y-1">
          <h1 className="font-heading text-2xl font-semibold">Users</h1>
          <p className="text-sm text-muted-foreground">
            Manage all system users across admin, doctors, receptionists, and patients.
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
              className="h-11 rounded-2xl border-2 border-sidebar-border pl-11"
              placeholder="Search user or email..."
            />
          </div>
          <Button variant="outline" size="lg" className="rounded-2xl">
            <HugeiconsIcon icon={FilterIcon} strokeWidth={1.8} />
            Filter
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-4xl border border-sidebar-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Users</p>
          <p className="mt-2 text-3xl font-semibold">{users.length}</p>
        </div>
        <div className="rounded-4xl border border-sidebar-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Admins</p>
          <p className="mt-2 text-3xl font-semibold">{users.filter((u) => u.role === "Admin").length}</p>
        </div>
        <div className="rounded-4xl border border-sidebar-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Staff</p>
          <p className="mt-2 text-3xl font-semibold">{users.filter((u) => u.role === "Doctor" || u.role === "Receptionist").length}</p>
        </div>
        <div className="rounded-4xl border border-sidebar-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Active</p>
          <p className="mt-2 text-3xl font-semibold">{users.filter((u) => u.status === "Active").length}</p>
        </div>
      </div>

      <div className="rounded-4xl border border-sidebar-border bg-card shadow-sm">
        <div className="border-b border-sidebar-border px-5 py-4">
          <h2 className="font-semibold">User Directory</h2>
          <p className="text-sm text-muted-foreground">
            Role-aware list of everyone using the patient appointment system.
          </p>
        </div>
        <div className="divide-y divide-sidebar-border">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex flex-col justify-between gap-4 px-5 py-4 lg:flex-row lg:items-center"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <HugeiconsIcon icon={UserAccountIcon} strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="font-mono text-xs text-muted-foreground">{user.id}</p>
                  </div>
                </div>
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <HugeiconsIcon icon={Mail01Icon} strokeWidth={1.8} className="size-4" />
                  {user.email}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${roleClasses(user.role)}`}>
                  {user.role}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                  <HugeiconsIcon icon={Shield01Icon} strokeWidth={1.8} className="size-3.5" />
                  {user.status}
                </span>
                <Button variant="outline" className="rounded-2xl">
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
