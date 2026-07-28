"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import { createResetFormSchema } from "@/schema/user-form-schema"
import { FieldInput, FormInput } from "@/components/customs/form"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { authUserService } from "@/api/services/auth.service"
import { useState } from "react"
import { toast } from "react-toastify"
import { useTranslation } from "@/lib/i18n"

type ResetFormValues = z.infer<ReturnType<typeof createResetFormSchema>>

const ForgetPassword = () => {
     const [loading, setLoading] = useState(false)
     const [submittedEmail, setSubmittedEmail] = useState("")
     const { t } = useTranslation()

     const form = useForm<ResetFormValues>({
          resolver: zodResolver(createResetFormSchema(t)),
          defaultValues: {
               email: "",
          },
     })

     const handleSubmit = async (data: ResetFormValues) => {
          try {
               setLoading(true)
               await authUserService.requestPasswordReset({ email: data.email })
               toast.success(t("i18nAudit.passwordReset.sent"))
               setSubmittedEmail(data.email)
               form.reset()
          } catch (error: unknown) {
               const errorMessage =
                    (error as { response?: { data?: { email?: string[]; detail?: string } } })?.response?.data
               const msg =
                    errorMessage?.detail ||
                    errorMessage?.email?.[0] ||
                    t("i18nAudit.passwordReset.sendFailed")
               toast.error(msg)
          } finally {
               setLoading(false)
          }
     }

     return (
          <div className="flex items-center justify-center px-4">

               <div className="w-full max-w-md">
                    <FormInput
                         title={t("i18nAudit.passwordReset.title")}
                         description={t("i18nAudit.passwordReset.description")}
                    >
                         {submittedEmail ? (
                              <div className="mt-4 space-y-5">
                                   <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-sm text-emerald-700">
                                        {t("i18nAudit.passwordReset.sentTo", { email: submittedEmail })}
                                   </div>

                                   <div className="flex flex-col gap-3 sm:flex-row">
                                        <Button
                                             type="button"
                                             className="w-full bg-chart-3 p-5 hover:opacity-90"
                                             onClick={() => setSubmittedEmail("")}
                                        >
                                             {t("i18nAudit.passwordReset.sendAnother")}
                                        </Button>
                                        <Button asChild type="button" variant="outline" className="w-full p-5">
                                             <Link href="/login">{t("i18nAudit.passwordReset.backToLogin")}</Link>
                                        </Button>
                                   </div>
                              </div>
                         ) : (
                              <form
                                   onSubmit={form.handleSubmit(handleSubmit)}
                                   className="mt-4 space-y-5"
                              >
                                   <FieldInput
                                        name="email"
                                        control={form.control}
                                        type="email"
                                        placeholder={t("auth.enterEmailAddress")}
                                        label={t("i18nAudit.passwordReset.emailAddress")}
                                   />

                                   <div className="flex justify-between text-sm">
                                        <Link
                                             href="/login"
                                             className="text-emerald-600 dark:text-emerald-400 hover:underline"
                                        >
                                             {t("i18nAudit.passwordReset.backToLogin")}
                                        </Link>

                                        <Link
                                             href="/register"
                                             className="text-emerald-600 dark:text-emerald-400 hover:underline"
                                        >
                                             {t("i18nAudit.passwordReset.createAccount")}
                                        </Link>
                                   </div>

                                   <Button
                                        type="submit"
                                        disabled={loading}
                                             className="w-full bg-chart-3 p-5  transition hover:opacity-90 rounded-md"
                                   >
                                        {loading ? <Spinner /> : t("i18nAudit.passwordReset.sendLink")}
                                   </Button>
                              </form>
                         )}
                    </FormInput>
               </div>
          </div>
     )
}

export default ForgetPassword
