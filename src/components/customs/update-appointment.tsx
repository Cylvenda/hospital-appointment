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
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { DatePicker } from "@/components/ui/date-picker"
import { toast } from "react-toastify"
import { useAppointmentStore } from "@/store/appointments/appointment.store"
import type { Appointment } from "@/store/appointments/appointment.types"
import { HugeiconsIcon } from "@hugeicons/react"
import { Edit01Icon, Calendar03Icon, MedicineBottle01Icon, Tick02Icon, Cancel01Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

type Props = {
     appointment: Appointment
}

export const UpdateAppointmentDialog = ({ appointment }: Props) => {
     const { updateAppointment } = useAppointmentStore()

     const [open, setOpen] = useState(false)
     const [loading, setLoading] = useState(false)
     const [description, setDescription] = useState(appointment.note)
     const [preferredDate, setPreferredDate] = useState(appointment.preferredDate || "")
     const [preferredDate2, setPreferredDate2] = useState(appointment.preferredDate2 || "")
     const [preferredDate3, setPreferredDate3] = useState(appointment.preferredDate3 || "")

     const canSubmit = !!description.trim() && !!preferredDate && !!preferredDate2 && !!preferredDate3

     const handleUpdate = async () => {
          if (!canSubmit || loading) return

          setLoading(true)
          try {
               await updateAppointment(appointment.id, {
                    description: description.trim(),
                    preferred_date: preferredDate,
                    preferred_date_2: preferredDate2,
                    preferred_date_3: preferredDate3,
               })

               toast.success("Appointment updated successfully.")
               setOpen(false)
          } catch {
               toast.error("Failed to update appointment.")
          } finally {
               setLoading(false)
          }
     }

     return (
          <Dialog open={open} onOpenChange={setOpen}>
               <DialogTrigger asChild>
                    <Button variant="outline" className="rounded-md h-11 px-6 border-2 font-bold hover:bg-primary/5 transition-all active:scale-95">
                         <HugeiconsIcon icon={Edit01Icon} className="w-4 h-4 mr-2" />
                         Refine Details
                    </Button>
               </DialogTrigger>

               <DialogContent className="sm:max-w-2xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
                    <div className="bg-primary p-8 text-white">
                         <DialogHeader>
                              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-4 backdrop-blur-md">
                                   <HugeiconsIcon icon={Edit01Icon} className="w-6 h-6 text-white" />
                              </div>
                              <DialogTitle className="text-3xl font-black tracking-tight text-white">Update Appointment</DialogTitle>
                              <DialogDescription className="text-white/80 font-medium text-lg">
                                   Refine your symptoms and availability choices.
                              </DialogDescription>
                         </DialogHeader>
                    </div>

                    <div className="p-8 space-y-8">
                         <div className="space-y-4">
                              <div className="flex items-center gap-2 mb-2">
                                   <div className="w-1 h-4 bg-primary rounded-full" />
                                   <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground opacity-60">Availability Preferences</h3>
                              </div>
                              <div className="grid gap-4 sm:grid-cols-3">
                                   {[
                                        { label: "Option 1", value: preferredDate, setter: setPreferredDate },
                                        { label: "Option 2", value: preferredDate2, setter: setPreferredDate2 },
                                        { label: "Option 3", value: preferredDate3, setter: setPreferredDate3 },
                                   ].map((item, idx) => (
                                        <div key={idx} className="space-y-2 group">
                                             <label className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground ml-1">{item.label}</label>
                                             <DatePicker
                                                  value={item.value}
                                                  onChange={item.setter}
                                                  className="rounded-2xl h-12 border-2 focus:border-primary transition-all bg-muted/20 focus:bg-background font-bold text-center"
                                             />
                                        </div>
                                   ))}
                              </div>
                         </div>

                         <div className="space-y-4">
                              <div className="flex items-center gap-2 mb-2">
                                   <div className="w-1 h-4 bg-primary rounded-full" />
                                   <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground opacity-60">Detailed Description</h3>
                              </div>
                              <div className="relative group">
                                   <HugeiconsIcon icon={MedicineBottle01Icon} className="absolute left-5 top-5 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                   <Textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Briefly explain your symptoms or reason for visit..."
                                        className="min-h-40 rounded-3xl pl-14 pt-5 border-2 focus:border-primary transition-all bg-muted/20 focus:bg-background text-base font-medium resize-none"
                                   />
                              </div>
                         </div>
                    </div>

                    <DialogFooter className="p-8 bg-muted/30 border-t flex items-center justify-between gap-4">
                         <Button variant="ghost" onClick={() => setOpen(false)} disabled={loading} className="rounded-md h-14 px-8 font-bold text-muted-foreground hover:text-foreground">
                              <HugeiconsIcon icon={Cancel01Icon} className="w-5 h-5 mr-2" />
                              Discard Changes
                         </Button>
                         <Button onClick={handleUpdate} disabled={!canSubmit || loading} className="rounded-md h-14 px-12 font-black shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95">
                              <HugeiconsIcon icon={Tick02Icon} className="w-5 h-5 mr-2" />
                              {loading ? "Syncing..." : "Update Appointment"}
                         </Button>
                    </DialogFooter>
               </DialogContent>
          </Dialog>
     )
}
