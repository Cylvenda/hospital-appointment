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
import { useTranslation } from "@/lib/i18n"

type Props = {
     onConfirm: (reason: string) => void
}

export const CancelAppointment = ({ onConfirm }: Props) => {
     const { t } = useTranslation()
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
                         {t("sharedAudit.cancelAppointment")}
                    </Button>
               </DialogTrigger>

               <DialogContent className="sm:max-w-md p-6 rounded-md max-w-2xl! border border-red-700">
                    {/* HEADER */}
                    <DialogHeader className="space-y-2">
                         <DialogTitle className="text-xl font-semibold text-red-600">
                              {t("sharedAudit.cancelAppointment")}
                         </DialogTitle>

                         <DialogDescription className="leading-6 text-muted-foreground">
                              {t("sharedAudit.cancelDescription")}
                         </DialogDescription>
                    </DialogHeader>

                    {/* INFO BOX */}
                    <div className="rounded-xl border border-red-700 bg-red-200 p-4 text-sm space-y-1">
                         <p className="font-medium text-foreground">
                              {t("sharedAudit.cancelReasonTitle")}
                         </p>
                         <p className="text-muted-foreground">
                              {t("sharedAudit.cancelReasonHelp")}
                         </p>
                    </div>

                    {/* TEXTAREA */}
                    <div className="space-y-2">
                         <Textarea
                              placeholder={t("sharedAudit.cancelReasonPlaceholder")}
                              value={reason}
                              onChange={(e) => setReason(e.target.value)}
                              className="min-h-27.5 rounded-lg"
                         />

                         {!reason.trim() && (
                              <p className="text-xs text-muted-foreground">
                                   {t("sharedAudit.cancelReasonRequired")}
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
                              {t("sharedAudit.keepAppointment")}
                         </Button>

                         <Button
                              variant="destructive"
                              onClick={handleConfirm}
                              disabled={!reason.trim()}
                              className="rounded-md"
                         >
                              {t("sharedAudit.confirmCancellation")}
                         </Button>
                    </DialogFooter>
               </DialogContent>
          </Dialog>
     )
}
