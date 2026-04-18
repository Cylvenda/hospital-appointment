"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthUserStore } from "@/store/auth/userAuth.store"
import { getDashboardPath } from "@/lib/role-dashboard"

type Props = {
     allowedRoles: string[]
     children: React.ReactNode
}

export const RoleAccessGuard: React.FC<Props> = ({ allowedRoles, children }) => {
     const router = useRouter()
     const checkAuth = useAuthUserStore((state) => state.checkAuth)
     const [isAuthorized, setIsAuthorized] = useState(false)

     useEffect(() => {
          let mounted = true

          void (async () => {
               const authenticated = await checkAuth()
               const currentUser = useAuthUserStore.getState().user

               if (!mounted) {
                    return
               }

               if (!authenticated || !currentUser) {
                    setIsAuthorized(false)
                    router.replace("/login")
                    return
               }

               if (!allowedRoles.includes(currentUser.role)) {
                    setIsAuthorized(false)
                    router.replace(getDashboardPath(currentUser.role))
                    return
               }

               setIsAuthorized(true)
          })()

          return () => {
               mounted = false
          }
     }, [allowedRoles, router, checkAuth])

     if (!isAuthorized) {
          return null
     }

     return <>{children}</>
}
