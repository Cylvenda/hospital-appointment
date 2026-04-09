"use client"

import PasswordResetConfirmForm from "@/components/auth/password-reset-confirm-form"
import { useParams } from "next/navigation"

export default function ResetPasswordFromEmailPage() {
     const params = useParams<{ uid: string; token: string }>()

     return (
          <PasswordResetConfirmForm
               uid={params?.uid ?? ""}
               token={params?.token ?? ""}
          />
     )
}
