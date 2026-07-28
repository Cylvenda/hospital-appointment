"use client"

import { useEffect, useState } from "react"
import {
     Dialog,
     DialogContent,
     DialogTitle,
     DialogDescription,
     DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "../ui/input"
import { useAuthUserStore } from "@/store/auth/userAuth.store"
import { toast } from "react-toastify"
import { useTranslation } from "@/lib/i18n"
import { useAppointmentStore } from "@/store/appointments/appointment.store"
import { usePaymentStore } from "@/store/payments/payment.store"
import { PaymentTemporarilyUnavailableError } from "@/store/payments/payment.store"
import Image from "next/image"
import { AlertCircleIcon, Clock01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

type Props = {
     appointmentId: string
     fee: string
     disabled?: boolean
}

// PHONE VALIDATION (TZ)
function validateTzPhone(phone: string): boolean {
     const cleaned = phone.trim().replace(/\s/g, "")

     const local = /^0[67]\d{8}$/
     const intl = /^\+255[67]\d{8}$/

     return local.test(cleaned) || intl.test(cleaned)
}

// NORMALIZE FOR API
function normalizeTzPhone(phone: string): string {
     const cleaned = phone.trim().replace(/\s/g, "")

     if (cleaned.startsWith("0")) {
          return "255" + cleaned.slice(1)
     }

     if (cleaned.startsWith("+255")) {
          return cleaned.replace("+", "")
     }

     return cleaned
}

export const PayingForAppointment = ({ appointmentId, fee, disabled }: Props) => {
     const { t, language } = useTranslation()
     const locale = language === "sw" ? "sw-TZ" : "en-US"
     const { user } = useAuthUserStore()
     const { createPayment, getPaymentStatus } = usePaymentStore()

     const [waiting, setWaiting] = useState(false)
     const [open, setOpen] = useState(false)
     const [phone, setPhone] = useState("")
     const [loading, setLoading] = useState(false)
     const [paymentUuid, setPaymentUuid] = useState<string | null>(null)
     const [paymentUnavailable, setPaymentUnavailable] = useState(false)

     useEffect(() => {
          if (open && user?.phone) {
               setPhone(user.phone)
          }
     }, [open, user])

     const isValidPhone = validateTzPhone(phone)

     useEffect(() => {
          if (!waiting || !paymentUuid) return
          let attempts = 0
          const maxAttempts = 30

          const interval = setInterval(async () => {
               attempts++
               try {
                    const status = await getPaymentStatus(paymentUuid)
                    if (
                         status === "success" ||
                         status === "failed" ||
                         status === "cancelled" ||
                         status === "expired"
                    ) {
                         clearInterval(interval)
                         useAppointmentStore.getState().initialize()
                         if (status === "success") {
                              toast.success(t("sharedAudit.paymentConfirmed"))
                         } else if (status === "failed") {
                              toast.error(t("sharedAudit.paymentFailed"))
                         } else {
                              toast.success(t("sharedAudit.paymentStatus", { status }))
                         }
                         setWaiting(false)
                    }
               } catch {
                    // ignore transient poll errors
               }
               if (attempts >= maxAttempts) {
                    clearInterval(interval)
                    setWaiting(false)
               }
          }, 10000)

          return () => clearInterval(interval)
     }, [waiting, paymentUuid, getPaymentStatus, t])

     const handlePay = async () => {
          if (!isValidPhone) return

          try {
               setLoading(true)
               setPaymentUnavailable(false)
               const formattedPhone = normalizeTzPhone(phone)
               const newPaymentUuid = await createPayment(appointmentId, formattedPhone)

               if (newPaymentUuid) {
                    setPaymentUuid(newPaymentUuid)
                    setWaiting(true)
               }

               setPhone("")
               setOpen(false)
          } catch (error: unknown) {
               if (error instanceof PaymentTemporarilyUnavailableError) {
                    setPaymentUnavailable(true)
                    return
               }
               const message =
                    error instanceof Error
                         ? error.message
                         : "Payment failed"

               toast.error(message)
          } finally {
               setLoading(false)
          }
     }

     return (
          <>
               <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                         <Button className="rounded-md" disabled={disabled}>
                              {t("sharedAudit.payAppointment")}
                         </Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-md max-w-3xl! p-0 overflow-hidden rounded-xl border shadow-lg">
                         {/* HEADER (Card style) */}
                         <div className="bg-linear-to-r from-blue-600 to-indigo-600 text-white p-5">
                              <DialogTitle className="text-lg font-semibold">
                                   {t("sharedAudit.mobilePayment")}
                              </DialogTitle>
                              <DialogDescription className="text-sm text-blue-100 mt-1">
                                   {t("sharedAudit.secureMobilePayment")}
                              </DialogDescription>
                         </div>

                         <div className="p-6 space-y-5">
                              {paymentUnavailable && (
                                   <div
                                        role="alert"
                                        className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-950 shadow-sm dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100"
                                   >
                                        <div className="flex items-start gap-3">
                                             <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                                                  <HugeiconsIcon icon={AlertCircleIcon} className="h-5 w-5" />
                                             </div>
                                             <div className="space-y-2">
                                                  <p className="font-semibold">
                                                       {t("sharedAudit.paymentUnavailable")}
                                                  </p>
                                                  <p className="text-sm leading-relaxed text-amber-800 dark:text-amber-200">
                                                       {t("sharedAudit.paymentUnavailableDescription")}
                                                  </p>
                                                  <div className="flex items-center gap-2 rounded-lg bg-white/60 px-3 py-2 text-xs font-medium dark:bg-black/10">
                                                       <HugeiconsIcon icon={Clock01Icon} className="h-4 w-4 shrink-0" />
                                                       {t("sharedAudit.tryPaymentLater")}
                                                  </div>
                                             </div>
                                        </div>
                                   </div>
                              )}

                              {/* PAYMENT MESSAGE */}
                              {!paymentUnavailable && (
                              <div className="text-sm text-muted-foreground leading-relaxed space-y-2">
                                   <p>{t("sharedAudit.paymentPrompt")}</p>

                                   <p>{t("sharedAudit.pinPrompt")}</p>

                                   <div className="text-xs bg-muted/50 border rounded-md px-3 py-2 flex justify-between items-center">
                                        <span>{t("sharedAudit.transactionFee")}</span>
                                        <span className="font-medium text-foreground">
                                             {new Intl.NumberFormat(locale, { style: "currency", currency: "TZS", maximumFractionDigits: 0 }).format(Number(fee))}
                                        </span>
                                   </div>
                              </div>
                              )}

                              {/* SUPPORTED NETWORKS */}
                              {!paymentUnavailable && <div className="space-y-3">
                                   <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                        {t("sharedAudit.supportedNetworks")}
                                   </p>

                                   <div className="flex items-center justify-between gap-2">
                                        {[
                                             { src: "/yas.webp", alt: "Mix by YAS" },
                                             { src: "/m-pesa.webp", alt: "M-PESA" },
                                             { src: "/airtel.webp", alt: "Airtel Money" },
                                             { src: "/halotel.webp", alt: "Halotel" },
                                        ].map((item, index) => (
                                             <div
                                                  key={index}
                                                  className="flex-1 flex items-center justify-center bg-white dark:bg-slate-900 border rounded-lg h-14"
                                             >
                                                  <Image
                                                       src={item.src}
                                                       alt={item.alt}
                                                       width={40}
                                                       height={40}
                                                       className="w-10 h-10 rounded-md object-center "
                                                  />
                                             </div>
                                        ))}
                                   </div>
                              </div>}

                              {/* NOTE */}
                              {!paymentUnavailable && <div className="rounded-lg border bg-muted/40 dark:bg-muted/10 p-3 text-xs leading-relaxed text-muted-foreground">
                                   <p>{t("sharedAudit.mobileOnly")}</p>

                                   <p className="mt-1">
                                        {t("sharedAudit.cardsComingSoon")}
                                   </p>
                              </div>}

                              {/* PHONE INPUT */}
                              {!paymentUnavailable && <div className="space-y-2">
                                   <Input
                                        placeholder="0712345678 or +255712345678"
                                        value={phone}
                                        onChange={(e) =>
                                             setPhone(e.target.value.replace(/\s/g, ""))
                                        }
                                        className="rounded-md"
                                   />

                                   {phone && !isValidPhone && (
                                        <p className="text-xs text-red-500">
                                             {t("sharedAudit.invalidPhone")}
                                        </p>
                                   )}
                              </div>}

                              {/* ACTIONS */}
                              <div className="flex gap-2 pt-2 justify-end w-full">
                                   <Button
                                        variant="outline"
                                        onClick={() => setOpen(false)}
                                        disabled={loading}
                                        className="w-fit rounded-md"
                                   >
                                        {paymentUnavailable ? t("sharedAudit.close") : t("sharedAudit.cancel")}
                                   </Button>

                                   {!paymentUnavailable && <Button
                                        onClick={handlePay}
                                        disabled={!isValidPhone || loading || disabled}
                                        className="w-fit rounded-md"
                                   >
                                        {loading ? t("sharedAudit.processing") : t("sharedAudit.payNow")}
                                   </Button>}
                              </div>
                         </div>
                    </DialogContent>

               </Dialog>

               <Dialog open={waiting} onOpenChange={setWaiting}>
                    <DialogContent className="sm:max-w-md rounded-xl p-6 text-center space-y-4">
                         {/* ICON / LOADER */}
                         <div className="flex justify-center">
                              <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                         </div>

                         {/* TITLE */}
                         <DialogTitle className="text-lg font-semibold">
                              {t("sharedAudit.waitingPayment")}
                         </DialogTitle>

                         {/* MESSAGE */}
                         <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
                              {t("sharedAudit.requestSent")}<br />
                              {t("sharedAudit.pinPrompt")}
                         </DialogDescription>

                         {/* EXTRA INFO */}
                         <div className="text-xs text-muted-foreground bg-muted/40 border rounded-md p-3">
                              {t("sharedAudit.doNotClose")}
                         </div>

                         {/* ACTION */}
                         <Button
                              variant="outline"
                              onClick={() => setWaiting(false)}
                              className="w-full"
                         >
                              {t("sharedAudit.close")}
                         </Button>
                    </DialogContent>
               </Dialog>
          </>
     )
}
