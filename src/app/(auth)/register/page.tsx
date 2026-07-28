"use client"

import { FieldInput, FormInput, PasswordInput } from "@/components/customs/form"
import { createRegisterFormSchema } from "@/schema/user-form-schema"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { zodResolver } from "@hookform/resolvers/zod"
import { authUserService } from "@/api/services/auth.service"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "react-toastify"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useTranslation } from "@/lib/i18n"

type RegisterFormValues = z.infer<ReturnType<typeof createRegisterFormSchema>>

const Register = () => {
     const { t } = useTranslation()
     const [loading, setLoading] = useState(false)
     const router = useRouter()

     const form = useForm<RegisterFormValues>({
          resolver: zodResolver(createRegisterFormSchema(t)),
          defaultValues: {
               email: "",
               phone: "",
               password: "",
          },
     })

     const onSubmitHandler = async (data: RegisterFormValues) => {
          try {
               setLoading(true)
               const res = await authUserService.userRegister(data)

               if (res.status === 201) {
                    toast.success(t("auth.registrationSuccessfulCheckEmail"))
                    router.push("/login?activation=sent")
               }

          } catch (error: unknown) {
               const errorMessage =
                    (error as { response?: { data?: { email?: string[]; phone?: string[]; password?: string[]; detail?: string } } })
                         ?.response?.data
               const msg =
                    errorMessage?.detail ||
                    errorMessage?.email?.[0] ||
                    errorMessage?.phone?.[0] ||
                    errorMessage?.password?.[0] ||
                    t("auth.registrationFailedTryAgain")

               toast.error(msg)
          } finally {
               setLoading(false)
          }
     }

     return (
          <div className=" flex items-center justify-center ">

               {/* FORM WRAPPER */}
               <div className="w-full ">
                    <FormInput
                         title={t("auth.createAccount")}
                         description={t("auth.patientAppointmentsDescription")}
                         className="border-0! shadow-none! ring-0! bg-transparent"
                    >
                         <form
                              onSubmit={form.handleSubmit(onSubmitHandler)}
                              className="space-y-5 mt-2 p-2"
                         >
                              {/* EMAIL */}
                              <FieldInput
                                   control={form.control}
                                   type="email"
                                   name="email"
                                   placeholder={t("auth.enterEmailAddress")}
                                   label={t("auth.email")}
                              />

                              {/* PHONE */}
                              <FieldInput
                                   control={form.control}
                                   type="tel"
                                   name="phone"
                                   placeholder={t("auth.enterPhoneNumber")}
                                   label={t("auth.phone")}
                              />

                              {/* PASSWORD */}
                              <PasswordInput
                                   control={form.control}
                                   label={t("auth.password")}
                                   name="password"
                                   placeholder={t("auth.enterPassword")}
                              />

                              {/* LOGIN LINK */}
                              <div className="flex justify-end">
                                   <Link
                                        href="/login"
                                        className="text-sm text-primary hover:underline"
                                   >
                                        {t("auth.alreadyHaveAccount")}
                                   </Link>
                              </div>

                              {/* SUBMIT */}
                              <Button
                                   type="submit"
                                   disabled={loading}
                                   className="w-full bg-chart-3 hover:opacity-90 transition rounded-md p-5"
                              >
                                   {loading ? <Spinner /> : t("auth.createAccount")}
                              </Button>
                         </form>
                    </FormInput>
               </div>
          </div>
     )
}

export default Register
