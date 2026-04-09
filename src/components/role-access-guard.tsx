"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthUserStore } from "@/store/auth/userAuth.store"
import { getDashboardPath } from "@/lib/role-dashboard"

type Props = {
     allowedRoles: string[]
}

export function RoleAccessGuard({ allowedRoles }: Props) {
     const router = useRouter()
     const { user, checkAuth } = useAuthUserStore()
     const [checking, setChecking] = useState(true)

     useEffect(() => {
          let mounted = true

          void (async () => {
               await checkAuth()
               if (mounted) setChecking(false)
          })()

          return () => {
               mounted = false
          }
     }, [checkAuth])

     useEffect(() => {
          if (checking) return

          if (!user) {
               router.replace("/login")
               return
          }

          if (!allowedRoles.includes(user.role)) {
               router.replace(getDashboardPath(user.role))
          }
     }, [allowedRoles, checking, router, user])

     return null
}
