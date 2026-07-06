"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { FormInput, FieldInput, PasswordInput } from "@/components/customs/form"
import Link from "next/link"
import { useAuthUserStore } from "@/store/auth/userAuth.store"
import { Suspense, useState } from "react"
import { authUserService } from "@/api/services/auth.service"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "react-toastify"
import { Spinner } from "@/components/ui/spinner"
import { LoginFormSchema } from "@/schema/user-form-schema"
import { getDashboardPath } from "@/lib/role-dashboard"
import { useTranslation } from "@/lib/i18n"


type LoginFormValues = z.infer<typeof LoginFormSchema>

function LoginForm() {
     const { t } = useTranslation()
     const router = useRouter()
     const searchParams = useSearchParams()
     const [loading, setLoading] = useState(false)
     const { fetchUser } = useAuthUserStore()
     const activationSent = searchParams.get("activation") === "sent"

     const form = useForm<LoginFormValues>({
          resolver: zodResolver(LoginFormSchema),
          defaultValues: {
               email: "",
               password: "",
          },
     })

     const onSubmit = async (data: LoginFormValues) => {
          setLoading(true)

          try {
               const res = await authUserService.userLogin(data)

               if (res.status === 200) {
                    const currentUser = await fetchUser()

                    if (!currentUser) {
                         toast.error(t("auth.loginSucceededProfileFailed"))
                         return
                    }

                    if (!currentUser.is_active) {
                         toast.warning(t("auth.accountNotActivated"))
                         return
                    }

                    router.replace(getDashboardPath(currentUser.role))
                    router.refresh()
                    toast.success(t("auth.loginSuccessful"))
               }
          } catch (error: unknown) {
               const errorData = (error as { response?: { data?: { detail?: string } } })?.response?.data
               toast.error(errorData?.detail || t("auth.loginFailedCheckCredentials"))
          } finally {
               setLoading(false)
          }
     }


     return (
          <div className="w-full">
               <FormInput
                    title={t("auth.welcomeBack")}
                    description={t("auth.loginToAccount")}
               >
                    <form
                         onSubmit={form.handleSubmit(onSubmit)}
                         className="space-y-5"
                    >
                         {activationSent && (
                              <div className="rounded-md border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-foreground">
                                   {t("auth.registrationActivationSent")}
                              </div>
                         )}

                         {/* EMAIL */}
                         <FieldInput
                              control={form.control}
                              name="email"
                              type="email"
                              label={t("auth.email")}
                              placeholder={t("auth.enterEmail")}
                         />

                         {/* PASSWORD */}
                         <PasswordInput
                              control={form.control}
                              name="password"
                              label={t("auth.password")}
                              placeholder={t("auth.enterPassword")}
                              forgetPassword={{
                                   text: t("auth.forgotPassword"),
                                   location: "/reset",
                              }}
                         />

                         {/* SUBMIT */}
                         <Button type="submit" disabled={loading} className="w-full p-5 bg-chart-3 hover:bg-chart-2 rounded-md">
                              {loading ? <Spinner /> : t("auth.signIn")}
                         </Button>

                         {/* FOOTER */}
                         <p className="text-center text-sm text-muted-foreground">
                              {t("auth.dontHaveAccount")} {" "}
                              <Link
                                   href="/register"
                                   className="text-primary hover:underline"
                              >
                                   {t("auth.signUp")}
                              </Link>
                         </p>
                    </form>
               </FormInput>
          </div>
     )
}

export default function LoginPage() {
     return (
          <Suspense fallback={<div className="min-h-96 animate-pulse rounded-2xl bg-muted/30" />}>
               <LoginForm />
          </Suspense>
     )
}
