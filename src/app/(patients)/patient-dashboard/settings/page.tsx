"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuthUserStore } from "@/store/auth/userAuth.store"

export default function PatientSettingsPage() {
  const router = useRouter()
  const logout = useAuthUserStore((state) => state.logout)

  return (
    <div className="w-full max-w-6xl">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Manage your account session and preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-2xl border p-4">
            <p className="font-medium">Sign out from this device</p>
            <p className="text-sm text-muted-foreground">
              You can safely logout and sign back in anytime.
            </p>
            <Button
              className="mt-3"
              variant="outline"
              onClick={async () => {
                await logout()
                router.replace("/login")
              }}
            >
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
