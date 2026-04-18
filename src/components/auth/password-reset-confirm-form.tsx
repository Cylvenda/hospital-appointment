"use client"

import { authUserService } from "@/api/services/auth.service"
import { FormInput, PasswordInput } from "@/components/customs/form"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { ResetConfirmFormSchema } from "@/schema/user-form-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { z } from "zod"

type ResetConfirmFormValues = z.infer<typeof ResetConfirmFormSchema>

type Props = {
     uid: string
     token: string
}

export default function PasswordResetConfirmForm({ uid, token }: Props) {
     const router = useRouter()
     const [loading, setLoading] = useState(false)

     const form = useForm<ResetConfirmFormValues>({
          resolver: zodResolver(ResetConfirmFormSchema),
          defaultValues: {
               newPassword: "",
               confirmPassword: "",
          },
     })

     const onSubmit = async (data: ResetConfirmFormValues) => {
          if (!uid || !token) {
               toast.error("Invalid reset link.")
               return
          }

          try {
               setLoading(true)
               await authUserService.confirmPasswordReset({
                    uid,
                    token,
                    new_password: data.newPassword,
               })

               toast.success("Password reset successful. Please log in.")
               router.replace("/login")
          } catch (error: unknown) {
               const errorData = (error as {
                    response?: {
                         data?: {
                              detail?: string
                              token?: string[]
                              uid?: string[]
                              new_password?: string[]
                         }
                    }
               })?.response?.data

               const msg =
                    errorData?.detail ||
                    errorData?.token?.[0] ||
                    errorData?.uid?.[0] ||
                    errorData?.new_password?.[0] ||
                    "Could not reset password. The link may be invalid or expired."

               toast.error(msg)
          } finally {
               setLoading(false)
          }
     }

     return (
          <div className="w-full max-w-md">
               <FormInput
                    title="Set New Password"
                    description="Choose a strong password for your account"
               >
                    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-2 space-y-5">
                         <PasswordInput
                              control={form.control}
                              name="newPassword"
                              label="New Password"
                              placeholder="Enter new password"
                         />

                         <PasswordInput
                              control={form.control}
                              name="confirmPassword"
                              label="Confirm Password"
                              placeholder="Re-enter new password"
                         />

                         <Button
                              type="submit"
                              disabled={loading}
                              className="w-full bg-chart-3 p-5 hover:bg-chart-2 rounded-md"
                         >
                              {loading ? <Spinner /> : "Update Password"}
                         </Button>

                         <p className="text-center text-sm text-muted-foreground">
                              Back to{" "}
                              <Link href="/login" className="text-blue-500 hover:underline">
                                   Login
                              </Link>
                         </p>
                    </form>
               </FormInput>
          </div>
     )
}
