import { UnifiedSearch } from "@/components/unified-search"
import { Metadata } from "next"
import { useAuthUserStore } from "@/store/auth/userAuth.store"
import { useTranslation } from "@/lib/i18n"

export const metadata: Metadata = {
     title: "Search | Admin Dashboard",
     description: "Search patients and appointments",
}

export default function SearchPage() {
     const { t } = useTranslation()
     const user = useAuthUserStore((state) => state.user)

     return (
          <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
               <div className="space-y-1">
                    <h1 className="text-2xl font-semibold">
                      {t("workflowDashboard.adminWelcome", {
                        name: user?.first_name || t("workflowDashboard.adminFallback"),
                      })}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      {t("search.recordLookup")}
                    </p>
               </div>
               <UnifiedSearch />
          </div>
     )
}
