"use client"

import { useEffect } from "react"
import { useAuthUserStore } from "@/store/auth/userAuth.store"

export function AuthBootstrap() {
     const initAuth = useAuthUserStore((state) => state.initAuth)

     useEffect(() => {
          void initAuth()
     }, [initAuth])

     return null
}
