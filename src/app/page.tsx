"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuthUserStore } from "@/store/auth/userAuth.store"
import { getDashboardPath } from "@/lib/role-dashboard"

const Page = () => {
     const router = useRouter()
     const { user, checkAuth } = useAuthUserStore()

     useEffect(() => {
          void (async () => {
               const authenticated = await checkAuth()
               if (authenticated) {
                    const resolvedRole = useAuthUserStore.getState().user?.role
                    router.replace(getDashboardPath(resolvedRole))
               }
          })()
     }, [checkAuth, router, user?.role])

     return (
          <div className="flex flex-row items-center justify-center w-screen mt-auto">
               <Button ><Link href="/register">Register</Link></Button>
               <Button><Link href="/login">Login</Link></Button>
          </div>
     )
}

export default Page