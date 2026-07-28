"use client"

import { userServices } from "@/api/services/user.service"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { FormEvent, useEffect, useMemo, useState } from "react"
import { toast } from "react-toastify"
import { useTranslation } from "@/lib/i18n"

type ActivationState = "loading" | "success" | "error"

export default function ActivateAccountPage() {
     const params = useParams<{ uid: string; token: string }>()
     const router = useRouter()
     const { t } = useTranslation()

     const uid = useMemo(() => params?.uid ?? "", [params?.uid])
     const token = useMemo(() => params?.token ?? "", [params?.token])

     const [status, setStatus] = useState<ActivationState>("loading")
     const [messageKey, setMessageKey] = useState("i18nAudit.activation.activatingAccount")
     const [serverMessage, setServerMessage] = useState("")
     const [email, setEmail] = useState("")
     const [resending, setResending] = useState(false)

     useEffect(() => {
          const activateAccount = async () => {
               if (!uid || !token) {
                    setStatus("error")
                    setMessageKey("i18nAudit.activation.invalidLink")
                    return
               }

               try {
                    await userServices.accountActivation({ uid, token })
                    setStatus("success")
                    setMessageKey("i18nAudit.activation.activatedMessage")
                    toast.success(t("i18nAudit.activation.activatedToast"))
               } catch (error: unknown) {
                    const detail =
                         (error as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
                         t("i18nAudit.activation.failed")

                    setStatus("error")
                    setServerMessage(detail)
               }
          }

          activateAccount()
     }, [t, token, uid])

     const handleResendActivation = async (event: FormEvent<HTMLFormElement>) => {
          event.preventDefault()

          if (!email.trim()) {
               toast.error(t("i18nAudit.activation.enterEmailError"))
               return
          }

          try {
               setResending(true)
               await userServices.emailActivation(email.trim())
               toast.success(t("i18nAudit.activation.emailSent"))
               setEmail("")
          } catch (error: unknown) {
               const detail =
                    (error as { response?: { data?: { detail?: string; email?: string[] } } })?.response?.data
               const msg = detail?.detail || detail?.email?.[0] || t("i18nAudit.activation.resendFailed")
               toast.error(msg)
          } finally {
               setResending(false)
          }
     }

     return (
          <div className="w-full max-w-md">
               <div className="space-y-4 rounded-xl border bg-card p-6 shadow-sm">
                    <h1 className="text-2xl font-bold">{t("i18nAudit.activation.title")}</h1>
                    <p className="text-sm text-muted-foreground">{serverMessage || t(messageKey)}</p>

                    {status === "success" && (
                         <Button className="w-full p-5 bg-chart-3 hover:bg-chart-2" onClick={() => router.push("/login")}>
                              {t("i18nAudit.activation.goToLogin")}
                         </Button>
                    )}

                    {status === "loading" && (
                         <Button disabled className="w-full p-5">
                              {t("i18nAudit.activation.activating")}
                         </Button>
                    )}

                    {status === "error" && (
                         <>
                              <form onSubmit={handleResendActivation} className="space-y-3">
                                   <input
                                        type="email"
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                        placeholder={t("auth.enterEmail")}
                                        className="w-full rounded-md border px-3 py-2 text-sm"
                                   />
                                   <Button type="submit" disabled={resending} className="w-full p-5 bg-chart-3 hover:bg-chart-2">
                                        {resending ? t("i18nAudit.activation.sending") : t("i18nAudit.activation.resend")}
                                   </Button>
                              </form>

                              <p className="text-center text-sm text-muted-foreground">
                                   {t("i18nAudit.activation.backTo")} <Link href="/login" className="text-blue-500 hover:underline">{t("auth.login")}</Link>
                              </p>
                         </>
                    )}
               </div>
          </div>
     )
}
