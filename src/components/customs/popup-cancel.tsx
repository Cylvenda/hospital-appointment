"use client"

import { useState } from "react"
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
import { Textarea } from "@/components/ui/textarea"

type Props = {
     onConfirm: (reason: string) => void
}

export const CancelAppointment = ({ onConfirm }: Props) => {
     const [open, setOpen] = useState(false)
     const [reason, setReason] = useState("")

     const handleConfirm = () => {
          if (!reason.trim()) return
          onConfirm(reason)
          setReason("")
          setOpen(false)
     }

     return (
          <Dialog open={open} onOpenChange={setOpen}>
               <DialogTrigger asChild>
                    <Button variant="destructive" className="rounded-md">
                         Cancel Appointment
                    </Button>
               </DialogTrigger>

               <DialogContent className="sm:max-w-md p-6 rounded-md max-w-2xl! border border-red-700">
                    {/* HEADER */}
                    <DialogHeader className="space-y-2">
                         <DialogTitle className="text-xl font-semibold text-red-600">
                              Cancel Appointment
                         </DialogTitle>

                         <DialogDescription className="leading-6 text-muted-foreground">
                              You are about to cancel this appointment. This action may affect your
                              booking history and doctor scheduling availability.
                         </DialogDescription>
                    </DialogHeader>

                    {/* INFO BOX */}
                    <div className="rounded-xl border border-red-700 bg-red-200 p-4 text-sm space-y-1">
                         <p className="font-medium text-foreground">
                              Why we ask for a reason
                         </p>
                         <p className="text-muted-foreground">
                              Your feedback helps us improve scheduling efficiency and reduce
                              missed appointments for other patients.
                         </p>
                    </div>

                    {/* TEXTAREA */}
                    <div className="space-y-2">
                         <Textarea
                              placeholder="Please briefly explain why you are cancelling..."
                              value={reason}
                              onChange={(e) => setReason(e.target.value)}
                              className="min-h-27.5 rounded-lg"
                         />

                         {!reason.trim() && (
                              <p className="text-xs text-muted-foreground">
                                   A reason is required to continue
                              </p>
                         )}
                    </div>

                    {/* ACTIONS */}
                    <DialogFooter className="flex gap-2 pt-2">
                         <Button
                              variant="outline"
                              onClick={() => setOpen(false)}
                              className="rounded-md"
                         >
                              Keep Appointment
                         </Button>

                         <Button
                              variant="destructive"
                              onClick={handleConfirm}
                              disabled={!reason.trim()}
                              className="rounded-md"
                         >
                              Confirm Cancellation
                         </Button>
                    </DialogFooter>
               </DialogContent>
          </Dialog>
     )
}