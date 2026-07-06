"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuthUserStore } from "@/store/auth/userAuth.store"
import { useTranslation } from "@/lib/i18n"

export default function ReceptionistSettingsPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const logout = useAuthUserStore((state) => state.logout)

  return (
    <div className="w-full max-w-8xl">
      <Card>
        <CardHeader>
          <CardTitle>{t("nav.settings")}</CardTitle>
          <CardDescription>
            {t("settings.receptionistDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-2xl border p-4">
            <p className="font-medium">{t("nav.logOut")}</p>
            <p className="text-sm text-muted-foreground">
              {t("settings.receptionistSignOutHelp")}
            </p>
            <Button
              className="mt-3"
              variant="outline"
              onClick={async () => {
                await logout()
                router.replace("/login")
              }}
            >
              {t("nav.logOut")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
