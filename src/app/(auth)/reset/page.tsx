"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import { ResetFormSchema } from "@/schema/user-form-schema"
import { FieldInput, FormInput } from "@/components/customs/form"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { authUserService } from "@/api/services/auth.service"
import { useState } from "react"
import { toast } from "react-toastify"

type ResetFormValues = z.infer<typeof ResetFormSchema>

const ForgetPassword = () => {
     const [loading, setLoading] = useState(false)
     const [submittedEmail, setSubmittedEmail] = useState("")

     const form = useForm<ResetFormValues>({
          resolver: zodResolver(ResetFormSchema),
          defaultValues: {
               email: "",
          },
     })

     const handleSubmit = async (data: ResetFormValues) => {
          try {
               setLoading(true)
               await authUserService.requestPasswordReset({ email: data.email })
               toast.success("Password reset link sent. Please check your email.")
               setSubmittedEmail(data.email)
               form.reset()
          } catch (error: unknown) {
               const errorMessage =
                    (error as { response?: { data?: { email?: string[]; detail?: string } } })?.response?.data
               const msg =
                    errorMessage?.detail ||
                    errorMessage?.email?.[0] ||
                    "Could not send reset link. Please try again."
               toast.error(msg)
          } finally {
               setLoading(false)
          }
     }

     return (
          <div className="flex items-center justify-center px-4">

               <div className="w-full max-w-md">
                    <FormInput
                         title="Reset Password"
                         description="Enter your email and we’ll send you a reset link"
                    >
                         {submittedEmail ? (
                              <div className="mt-4 space-y-5">
                                   <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-sm text-emerald-700">
                                        A reset link has been sent to <span className="font-medium">{submittedEmail}</span>.
                                        Open the email and follow the link to choose a new password.
                                   </div>

                                   <div className="flex flex-col gap-3 sm:flex-row">
                                        <Button
                                             type="button"
                                             className="w-full bg-chart-3 p-5 hover:opacity-90"
                                             onClick={() => setSubmittedEmail("")}
                                        >
                                             Send Another Link
                                        </Button>
                                        <Button asChild type="button" variant="outline" className="w-full p-5">
                                             <Link href="/login">Back to Login</Link>
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
                                        placeholder="Enter your email address"
                                        label="Email Address"
                                   />

                                   <div className="flex justify-between text-sm">
                                        <Link
                                             href="/login"
                                             className="text-blue-500 hover:underline"
                                        >
                                             Back to Login
                                        </Link>

                                        <Link
                                             href="/register"
                                             className="text-blue-500 hover:underline"
                                        >
                                             Create account
                                        </Link>
                                   </div>

                                   <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-chart-3 p-5 transition hover:opacity-90"
                                   >
                                        {loading ? <Spinner /> : "Send Reset Link"}
                                   </Button>
                              </form>
                         )}
                    </FormInput>
               </div>
          </div>
     )
}

export default ForgetPassword
