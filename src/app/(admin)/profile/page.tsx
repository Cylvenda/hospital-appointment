import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Briefcase01Icon,
  CallIcon,
  Edit02Icon,
  Location01Icon,
  Mail01Icon,
  Shield01Icon,
  UserAccountIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

export default function ProfilePage() {
  return (
    <div className="w-full space-y-6 p-4 md:p-6">
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-semibold">Profile</h1>
        <p className="text-sm text-muted-foreground">
          Review and update your admin profile, contact details, and permissions summary.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-4xl border border-sidebar-border bg-card p-6 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-4xl bg-primary/10 text-primary">
              <HugeiconsIcon icon={UserAccountIcon} strokeWidth={1.8} className="size-10" />
            </div>
            <h2 className="mt-4 text-xl font-semibold">Amina Kassim</h2>
            <p className="text-sm text-muted-foreground">System Administrator</p>
          </div>

          <div className="mt-6 space-y-4 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <HugeiconsIcon icon={Mail01Icon} strokeWidth={1.8} className="size-4" />
              amina.kassim@pams.com
            </p>
            <p className="flex items-center gap-2">
              <HugeiconsIcon icon={CallIcon} strokeWidth={1.8} className="size-4" />
              +255 719 220 411
            </p>
            <p className="flex items-center gap-2">
              <HugeiconsIcon icon={Location01Icon} strokeWidth={1.8} className="size-4" />
              Dar es Salaam, Tanzania
            </p>
            <p className="flex items-center gap-2">
              <HugeiconsIcon icon={Briefcase01Icon} strokeWidth={1.8} className="size-4" />
              Platform Operations
            </p>
          </div>

          <div className="mt-6 rounded-3xl bg-muted/60 p-4">
            <p className="flex items-center gap-2 text-sm font-medium">
              <HugeiconsIcon icon={Shield01Icon} strokeWidth={1.8} className="size-4 text-primary" />
              Access Level
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Full access to appointments, users, doctors, reception desks, and clinic configuration.
            </p>
          </div>
        </div>

        <div className="rounded-4xl border border-sidebar-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Update Profile</h2>
              <p className="text-sm text-muted-foreground">
                Keep your admin information current for notifications and audit logs.
              </p>
            </div>
            <Button className="rounded-2xl">
              <HugeiconsIcon icon={Edit02Icon} strokeWidth={1.8} />
              Save Changes
            </Button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">First Name</label>
              <Input defaultValue="Amina" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Last Name</label>
              <Input defaultValue="Kassim" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input defaultValue="amina.kassim@pams.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input defaultValue="+255 719 220 411" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Department</label>
              <Input defaultValue="Platform Operations" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Input defaultValue="Admin" disabled />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
