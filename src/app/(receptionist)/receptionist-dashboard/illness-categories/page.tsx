"use client"

import { useEffect, useMemo, useState } from "react"
import { toast } from "react-toastify"
import { motion, AnimatePresence } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Delete02Icon,
  Edit02Icon,
  MedicineBottle01Icon,
  PlusSignIcon,
  Search01Icon,
  Medicine01Icon,
  DatabaseIcon,
  FilterIcon,
  Tick02Icon,
  Cancel01Icon,
  AlertCircleIcon
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { useAppointmentStore } from "@/store/appointments/appointment.store"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"

const emptyForm = {
  name: "",
  description: "",
}

export default function ReceptionistDepartmentsPage() {
  const { t } = useTranslation()
  const {
    illnessCategories,
    fetchIllnessCategories,
    createIllnessCategory,
    updateIllnessCategory,
    deleteIllnessCategory,
  } = useAppointmentStore()

  const [search, setSearch] = useState("")
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{
    uuid: string
    name: string
  } | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    void fetchIllnessCategories()
  }, [fetchIllnessCategories])

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase()

    return illnessCategories.filter((category) =>
      [category.name, category.description ?? ""].join(" ").toLowerCase().includes(query)
    )
  }, [illnessCategories, search])

  const categoriesWithDescriptions = filteredCategories.filter(
    (category) => Boolean(category.description?.trim())
  ).length

  const formTitle = editingId ? t("departmentManagement.update") : t("departmentManagement.add")
  const formDescription = editingId
    ? t("departmentManagement.updateDescription")
    : t("departmentManagement.addDescription")

  const isFormValid = form.name.trim().length > 0

  function resetForm() {
    setForm(emptyForm)
    setEditingId(null)
  }

  async function handleSubmit() {
    if (!isFormValid || isSaving) {
      return
    }

    setIsSaving(true)

    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
      }

      if (editingId) {
        await updateIllnessCategory(editingId, payload)
        toast.success(t("departmentManagement.updated"))
      } else {
        await createIllnessCategory(payload)
        toast.success(t("departmentManagement.created"))
      }

      resetForm()
    } catch {
      toast.error(editingId ? t("departmentManagement.updateError") : t("departmentManagement.createError"))
    } finally {
      setIsSaving(false)
    }
  }

  function handleEdit(uuid: string) {
    const category = illnessCategories.find((item) => item.id === uuid)
    if (category) {
      setEditingId(category.id)
      setForm({
        name: category.name,
        description: category.description ?? "",
      })
      // Scroll to top or form on mobile
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  async function handleDelete() {
    if (!deleteTarget || isDeleting) {
      return
    }

    setIsDeleting(true)

    try {
      await deleteIllnessCategory(deleteTarget.uuid)
      toast.success(t("departmentManagement.deleted"))

      if (editingId === deleteTarget.uuid) {
        resetForm()
      }

      setDeleteTarget(null)
    } catch {
      toast.error(t("departmentManagement.deleteError"))
    } finally {
      setIsDeleting(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  return (
    <div className="w-full space-y-10 p-4 md:p-8">
      {/* HEADER */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end"
      >
        <div className="space-y-2">
           <h1 className="text-4xl font-black tracking-tight">{t("departmentManagement.title")}</h1>
           <p className="text-muted-foreground text-lg max-w-2xl">
             {t("departmentManagement.subtitle")}
           </p>
        </div>

        <div className="relative group sm:w-96">
          <HugeiconsIcon
            icon={Search01Icon}
            strokeWidth={2.5}
            className="absolute top-1/2 left-5 size-5 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
          />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-14 rounded-3xl border-2 border-muted bg-background pl-14 pr-6 focus:border-primary focus:ring-0 transition-all text-base font-medium shadow-sm"
            placeholder={t("departmentManagement.filter")}
          />
        </div>
      </motion.div>

      {/* STATS */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-6 md:grid-cols-3"
      >
        {[
          { label: t("departmentManagement.totalRegistered"), value: illnessCategories.length, icon: DatabaseIcon, color: "text-blue-600", bg: "bg-blue-50" },
          { label: t("departmentManagement.activeResults"), value: filteredCategories.length, icon: FilterIcon, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: t("departmentManagement.detailedEntries"), value: categoriesWithDescriptions, icon: MedicineBottle01Icon, color: "text-emerald-600", bg: "bg-emerald-50" },
        ].map((stat, i) => (
          <motion.div key={i} variants={itemVariants}>
            <Card className="rounded-[2.5rem] border-none shadow-sm bg-card hover:shadow-md transition-shadow overflow-hidden group">
              <CardContent className="flex items-center gap-4 p-4 sm:gap-6 sm:p-6 md:p-8">
                <div className={cn("w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                  <HugeiconsIcon icon={stat.icon} className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm font-black uppercase tracking-widest text-muted-foreground opacity-60">{stat.label}</p>
                  <p className="text-3xl font-black mt-1">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid gap-8 xl:grid-cols-[1fr_2fr]">
        {/* FORM */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Card className="overflow-hidden rounded-3xl border-2 shadow-xl xl:sticky xl:top-8 xl:rounded-[3rem]">
            <CardHeader className="border-b bg-muted/30 p-4 sm:p-6 md:p-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                  <HugeiconsIcon icon={editingId ? Edit02Icon : PlusSignIcon} className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-black">{formTitle}</CardTitle>
                  <CardDescription className="font-medium">{formDescription}</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-5 p-4 sm:space-y-6 sm:p-6 md:p-8">
              <div className="space-y-3">
                 <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">{t("departmentManagement.name")}</label>
                <Input
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, name: event.target.value }))
                  }
                  className="h-14 rounded-2xl border-2 bg-background focus:border-primary transition-all text-base font-bold px-6"
                  placeholder={t("departmentManagement.namePlaceholder")}
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">{t("departmentManagement.description")}</label>
                <Textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, description: event.target.value }))
                  }
                  className="min-h-[150px] rounded-2xl border-2 bg-background focus:border-primary transition-all text-base font-medium p-6 resize-none"
                   placeholder={t("departmentManagement.descriptionPlaceholder")}
                />
              </div>

              <div className="flex flex-col gap-4 pt-4">
                <Button 
                  onClick={handleSubmit} 
                  disabled={!isFormValid || isSaving} 
                  className="h-14 rounded-2xl text-base font-black shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
                >
                   {isSaving ? t("departmentManagement.processing") : editingId ? t("departmentManagement.update") : t("departmentManagement.register")}
                </Button>
                {(editingId || form.name || form.description) && (
                  <Button
                    variant="ghost"
                    onClick={resetForm}
                    disabled={isSaving}
                    className="h-12 rounded-2xl font-bold text-muted-foreground hover:text-foreground"
                  >
                    {t("departmentManagement.discard")}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* LIST */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <Card className="rounded-[3rem] border-2 shadow-xl overflow-hidden min-h-[600px]">
            <CardHeader className="border-b p-4 sm:p-6 md:p-8">
              <CardTitle className="text-2xl font-black flex items-center gap-3">
                 <HugeiconsIcon icon={Medicine01Icon} className="w-8 h-8 text-primary" />
                 {t("departmentManagement.directory")}
               </CardTitle>
            </CardHeader>

            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                     <TableHead className="px-8 h-14 text-xs font-black uppercase tracking-widest text-muted-foreground">{t("departmentManagement.title")}</TableHead>
                     <TableHead className="h-14 text-xs font-black uppercase tracking-widest text-muted-foreground">{t("departmentManagement.description")}</TableHead>
                     <TableHead className="h-14 text-xs font-black uppercase tracking-widest text-muted-foreground text-right px-8">{t("departmentManagement.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence mode="popLayout">
                    {filteredCategories.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="py-32 text-center">
                          <div className="flex flex-col items-center gap-4 text-muted-foreground">
                            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                              <HugeiconsIcon icon={Search01Icon} className="w-10 h-10 opacity-20" />
                            </div>
                             <p className="text-xl font-bold opacity-40">{t("departmentManagement.none")}</p>
                             <p className="text-sm">{t("departmentManagement.adjustSearch")}</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCategories.map((category) => (
                        <TableRow key={category.id} className="group hover:bg-primary/[0.02] transition-colors border-b">
                          <TableCell className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                                <HugeiconsIcon icon={MedicineBottle01Icon} className="w-6 h-6" />
                              </div>
                              <div>
                                <p className="font-black text-lg group-hover:text-primary transition-colors">{category.name}</p>
                                <p className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground opacity-40 mt-0.5">#{category.id.slice(0, 8)}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-md py-6">
                            <p className="text-sm font-medium text-muted-foreground line-clamp-2 leading-relaxed">
                              {category.description?.trim() || t("departmentManagement.noDescription")}
                            </p>
                          </TableCell>
                          <TableCell className="px-8 py-6 text-right">
                            <div className="flex justify-end gap-3">
                              <Button
                                variant="outline"
                                size="icon"
                                className="w-11 h-11 rounded-md border-2 hover:bg-primary hover:text-white hover:border-primary transition-all"
                                onClick={() => handleEdit(category.id)}
                              >
                                <HugeiconsIcon icon={Edit02Icon} className="w-5 h-5" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="w-11 h-11 rounded-md border-2 text-rose-600 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all"
                                onClick={() =>
                                  setDeleteTarget({
                                    uuid: category.id,
                                    name: category.name,
                                  })
                                }
                              >
                                <HugeiconsIcon icon={Delete02Icon} className="w-5 h-5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Dialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="max-w-md rounded-2xl border-2 p-4 sm:rounded-[2.5rem] sm:p-6 md:p-8">
          <DialogHeader className="space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-2">
              <HugeiconsIcon icon={AlertCircleIcon} className="w-8 h-8" />
            </div>
            <DialogTitle className="text-2xl font-black text-center">{t("departmentManagement.confirmDeletion")}</DialogTitle>
            <DialogDescription className="text-center text-base font-medium">
              {deleteTarget
                ? t("departmentManagement.deleteNamedDescription", { name: deleteTarget.name })
                 : t("departmentManagement.deleteDescription")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4 sm:justify-center">
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={isDeleting} className="h-14 rounded-md flex-1 font-bold">
              <HugeiconsIcon icon={Cancel01Icon} className="mr-2 w-5 h-5" />
               {t("departmentManagement.keep")}
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting} className="h-14 rounded-md flex-1 font-black shadow-lg shadow-rose-200">
              <HugeiconsIcon icon={Tick02Icon} className="mr-2 w-5 h-5" />
              {isDeleting ? t("departmentManagement.deleting") : t("departmentManagement.confirmDelete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
