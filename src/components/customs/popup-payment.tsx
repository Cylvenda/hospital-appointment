"use client"

import { useEffect, useState } from "react"
import {
     Dialog,
     DialogContent,
     DialogHeader,
     DialogTitle,
     DialogDescription,
     DialogFooter,
     DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "../ui/input"
import { useAuthUserStore } from "@/store/auth/userAuth.store"
import { toast } from "react-toastify"
import { useAppointmentStore } from "@/store/appointments/appointment.store"
import Image from "next/image"

type Props = {
     appointmentId: string
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

export const PayingForAppointment = ({ appointmentId, disabled }: Props) => {
     const { user } = useAuthUserStore()
     const { PayingAppointment } = useAppointmentStore()

     const [waiting, setWaiting] = useState(false)
     const [open, setOpen] = useState(false)
     const [phone, setPhone] = useState("")
     const [loading, setLoading] = useState(false)

     useEffect(() => {
          if (open && user?.phone) {
               setPhone(user.phone)
          }
     }, [open, user])

     const isValidPhone = validateTzPhone(phone)

     const handlePay = async () => {
          if (!isValidPhone) return

          try {
               setLoading(true)

               const formattedPhone = normalizeTzPhone(phone)

               await PayingAppointment(appointmentId, formattedPhone)

               toast.success("Payment Initiated Successfully check your phone to complete payment")

               setPhone("")
               setOpen(false)
               setWaiting(true)
          } catch (error: unknown) {
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
                              Pay Appointment
                         </Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-md max-w-3xl! p-0 overflow-hidden rounded-xl border shadow-lg">

                         {/* HEADER (Card style) */}
                         <div className="bg-linear-to-r from-blue-600 to-indigo-600 text-white p-5">
                              <DialogTitle className="text-lg font-semibold">
                                   Mobile Payment
                              </DialogTitle>
                              <DialogDescription className="text-sm text-blue-100 mt-1">
                                   Secure payment via mobile money
                              </DialogDescription>
                         </div>

                         <div className="p-6 space-y-5">

                              {/* PAYMENT MESSAGE */}
                              <div className="text-sm text-muted-foreground leading-relaxed space-y-2">
                                   <p>
                                        When you continue, you will receive a{" "}
                                        <span className="font-medium text-foreground">
                                             payment prompt
                                        </span>{" "}
                                        on your phone.
                                   </p>

                                   <p>
                                        Enter your{" "}
                                        <span className="font-medium text-foreground">
                                             mobile money PIN
                                        </span>{" "}
                                        to complete the transaction.
                                   </p>

                                   {/* FEE */}
                                   <div className="text-xs bg-muted/50 border rounded-md px-3 py-2 flex justify-between items-center">
                                        <span>Transaction Fee</span>
                                        <span className="font-medium text-foreground">
                                             5,000 TZS
                                        </span>
                                   </div>
                              </div>

                              {/* SUPPORTED NETWORKS */}
                              <div className="space-y-3">
                                   <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                        Supported Networks
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
                                                  className="flex-1 flex items-center justify-center bg-white border rounded-lg h-14"
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
                              </div>

                              {/* NOTE */}
                              <div className="rounded-lg border bg-muted/40 p-3 text-xs leading-relaxed text-muted-foreground">
                                   <p>
                                        Only{" "}
                                        <span className="font-medium text-foreground">
                                             mobile money payments
                                        </span>{" "}
                                        are supported at the moment.
                                   </p>

                                   <p className="mt-1">
                                        Credit/Debit card support will be available soon.
                                   </p>
                              </div>

                              {/* PHONE INPUT */}
                              <div className="space-y-2">
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
                                             Enter valid Tanzanian number
                                        </p>
                                   )}
                              </div>

                              {/* ACTIONS */}
                              <div className="flex gap-2 pt-2 justify-end w-full">
                                   <Button
                                        variant="outline"
                                        onClick={() => setOpen(false)}
                                        disabled={loading}
                                        className="w-fit rounded-md"
                                   >
                                        Cancel
                                   </Button>

                                   <Button
                                        onClick={handlePay}
                                        disabled={!isValidPhone || loading || disabled}
                                        className="w-fit rounded-md"
                                   >
                                        {loading ? "Processing..." : "Pay Now"}
                                   </Button>
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
                              Waiting for Payment Confirmation
                         </DialogTitle>

                         {/* MESSAGE */}
                         <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
                              A payment request has been sent to your phone.
                              <br />
                              Please enter your{" "}
                              <span className="font-medium text-foreground">
                                   mobile money PIN
                              </span>{" "}
                              to complete the transaction.
                         </DialogDescription>

                         {/* EXTRA INFO */}
                         <div className="text-xs text-muted-foreground bg-muted/40 border rounded-md p-3">
                              Do not close this window until you complete the payment.
                         </div>

                         {/* ACTION */}
                         <Button
                              variant="outline"
                              onClick={() => setWaiting(false)}
                              className="w-full"
                         >
                              Close
                         </Button>
                    </DialogContent>
               </Dialog>
          </>
     )
}