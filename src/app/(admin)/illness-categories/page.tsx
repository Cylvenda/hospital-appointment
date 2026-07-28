"use client"

import { useEffect, useMemo, useState } from "react"
import { toast } from "react-toastify"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Delete02Icon,
  Edit02Icon,
  MedicineBottle01Icon,
  PlusSignIcon,
  Search01Icon,
  TextAlignLeftIcon,
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
import { useAdminStore } from "@/store/admin/admin.store"
import { useTranslation } from "@/lib/i18n"

const emptyForm = {
  name: "",
  description: "",
}

export default function DepartmentsPage() {
  const { t } = useTranslation()
  const {
    illnessCategories,
    fetchIllnessCategories,
    createIllnessCategory,
    updateIllnessCategory,
    deleteIllnessCategory,
  } = useAdminStore()

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
    const category = illnessCategories.find((item) => item.uuid === uuid)
    if (!category) {
      return
    }

    setEditingId(category.uuid)
    setForm({
      name: category.name,
      description: category.description ?? "",
    })
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

  return (
    <div className="w-full space-y-6 p-4 md:p-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="space-y-1">
           <h1 className="font-heading text-2xl font-semibold">{t("departmentManagement.title")}</h1>
           <p className="text-sm text-muted-foreground">
             {t("departmentManagement.subtitle")}
           </p>
        </div>

        <div className="relative sm:w-80">
          <HugeiconsIcon
            icon={Search01Icon}
            strokeWidth={1.8}
            className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-11 rounded-2xl border-2 border-sidebar-border pl-11"
             placeholder={t("departmentManagement.search")}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-4xl border border-sidebar-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">{t("departmentManagement.total")}</p>
          <p className="mt-2 text-3xl font-semibold">{illnessCategories.length}</p>
        </div>
        <div className="rounded-4xl border border-sidebar-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">{t("departmentManagement.shown")}</p>
          <p className="mt-2 text-3xl font-semibold">{filteredCategories.length}</p>
        </div>
        <div className="rounded-4xl border border-sidebar-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">{t("departmentManagement.withDescriptions")}</p>
          <p className="mt-2 text-3xl font-semibold">{categoriesWithDescriptions}</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.35fr]">
        <Card className="border border-sidebar-border py-5 shadow-sm">
          <CardHeader className="border-b border-sidebar-border">
            <CardTitle>{formTitle}</CardTitle>
            <CardDescription>{formDescription}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 py-6">
            <div className="space-y-2">
               <label className="text-sm font-medium">{t("departmentManagement.name")}</label>
               <Input
                 value={form.name}
                 onChange={(event) =>
                   setForm((current) => ({ ...current, name: event.target.value }))
                 }
                 placeholder={t("departmentManagement.namePlaceholder")}
               />
            </div>

            <div className="space-y-2">
               <label className="text-sm font-medium">{t("departmentManagement.description")}</label>
               <Textarea
                 value={form.description}
                 onChange={(event) =>
                   setForm((current) => ({ ...current, description: event.target.value }))
                 }
                 placeholder={t("departmentManagement.descriptionPlaceholder")}
               />
            </div>

            <div className="flex flex-wrap gap-2">
               <Button onClick={handleSubmit} disabled={!isFormValid || isSaving} className="rounded-md">
                 <HugeiconsIcon icon={editingId ? Edit02Icon : PlusSignIcon} strokeWidth={1.8} />
                 {isSaving ? t("departmentManagement.saving") : editingId ? t("departmentManagement.update") : t("departmentManagement.add")}
               </Button>
              <Button
                variant="outline"
                onClick={resetForm}
                disabled={isSaving || (!editingId && !form.name && !form.description)}
                className="rounded-md"
              >
                {t("departmentManagement.reset")}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-sidebar-border py-5 shadow-sm">
          <CardHeader className="border-b border-sidebar-border">
            <CardTitle>{t("departmentManagement.directory")}</CardTitle>
            <CardDescription>
              {t("departmentManagement.directoryDescription")}
            </CardDescription>
          </CardHeader>

          <CardContent className="py-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("common.name")}</TableHead>
                  <TableHead>{t("departmentManagement.description")}</TableHead>
                  <TableHead>{t("departmentManagement.reference")}</TableHead>
                  <TableHead className="text-right">{t("departmentManagement.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                       {t("departmentManagement.none")}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((category) => (
                    <TableRow key={category.uuid}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <HugeiconsIcon icon={MedicineBottle01Icon} strokeWidth={1.8} className="size-4" />
                          </div>
                          <span>{category.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-md whitespace-normal text-sm text-muted-foreground">
                        <span className="inline-flex items-start gap-2">
                          <HugeiconsIcon icon={TextAlignLeftIcon} strokeWidth={1.8} className="mt-0.5 size-4 shrink-0" />
                          {category.description?.trim() || t("departmentManagement.noDescription")}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {category.uuid.slice(0, 8).toUpperCase()}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-md"
                            onClick={() => handleEdit(category.uuid)}
                          >
                            <HugeiconsIcon icon={Edit02Icon} strokeWidth={1.8} />
                            {t("departmentManagement.edit")}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="rounded-md"
                            onClick={() =>
                              setDeleteTarget({
                                uuid: category.uuid,
                                name: category.name,
                              })
                            }
                          >
                            <HugeiconsIcon icon={Delete02Icon} strokeWidth={1.8} />
                            {t("departmentManagement.delete")}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
             <DialogTitle>{t("departmentManagement.deleteTitle")}</DialogTitle>
             <DialogDescription>
               {deleteTarget
                 ? t("departmentManagement.deleteNamedDescription", { name: deleteTarget.name })
                 : t("departmentManagement.deleteDescription")}
             </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={isDeleting}>
              {t("departmentManagement.cancel")}
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
               {isDeleting ? t("departmentManagement.deleting") : t("departmentManagement.deleteTitle")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
