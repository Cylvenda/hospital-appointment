"use client"

import { authUserService } from "@/api/services/auth.service"
import { FormInput, PasswordInput } from "@/components/customs/form"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { createResetConfirmFormSchema } from "@/schema/user-form-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { z } from "zod"
import { useTranslation } from "@/lib/i18n"

type ResetConfirmFormValues = z.infer<ReturnType<typeof createResetConfirmFormSchema>>

type Props = {
     uid: string
     token: string
}

export default function PasswordResetConfirmForm({ uid, token }: Props) {
     const router = useRouter()
     const { t } = useTranslation()
     const [loading, setLoading] = useState(false)

     const form = useForm<ResetConfirmFormValues>({
          resolver: zodResolver(createResetConfirmFormSchema(t)),
          defaultValues: {
               newPassword: "",
               confirmPassword: "",
          },
     })

     const onSubmit = async (data: ResetConfirmFormValues) => {
          if (!uid || !token) {
               toast.error(t("i18nAudit.passwordReset.invalidLink"))
               return
          }

          try {
               setLoading(true)
               await authUserService.confirmPasswordReset({
                    uid,
                    token,
                    new_password: data.newPassword,
               })

               toast.success(t("i18nAudit.passwordReset.success"))
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
                    t("i18nAudit.passwordReset.failed")

               toast.error(msg)
          } finally {
               setLoading(false)
          }
     }

     return (
          <div className="w-full max-w-md">
               <FormInput
                    title={t("i18nAudit.passwordReset.setNew")}
                    description={t("i18nAudit.passwordReset.setNewDescription")}
               >
                    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-2 space-y-5">
                         <PasswordInput
                              control={form.control}
                              name="newPassword"
                              label={t("i18nAudit.passwordReset.newPassword")}
                              placeholder={t("i18nAudit.passwordReset.enterNew")}
                         />

                         <PasswordInput
                              control={form.control}
                              name="confirmPassword"
                              label={t("i18nAudit.passwordReset.confirmPassword")}
                              placeholder={t("i18nAudit.passwordReset.reenter")}
                         />

                         <Button
                              type="submit"
                              disabled={loading}
                              className="w-full bg-chart-3 p-5 hover:bg-chart-2 rounded-md"
                         >
                              {loading ? <Spinner /> : t("i18nAudit.passwordReset.update")}
                         </Button>

                         <p className="text-center text-sm text-muted-foreground">
                              {t("i18nAudit.passwordReset.backTo")}{" "}
                              <Link href="/login" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                                   {t("auth.login")}
                              </Link>
                         </p>
                    </form>
               </FormInput>
          </div>
     )
}
