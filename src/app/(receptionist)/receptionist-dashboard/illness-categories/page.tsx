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
import { useAppointmentStore } from "@/store/appointments/appointment.store"

const emptyForm = {
  name: "",
  description: "",
}

export default function ReceptionistIllnessCategoriesPage() {
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

  const formTitle = editingId ? "Update Illness Category" : "Add Illness Category"
  const formDescription = editingId
    ? "Edit the illness category details and save your changes."
    : "Create a new illness category for appointment booking and triage."

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
        toast.success("Illness category updated.")
      } else {
        await createIllnessCategory(payload)
        toast.success("Illness category added.")
      }

      resetForm()
    } catch {
      toast.error(editingId ? "Failed to update illness category." : "Failed to add illness category.")
    } finally {
      setIsSaving(false)
    }
  }

  function handleEdit(uuid: string) {
    const category = illnessCategories.find((item) => item.id === uuid)
    if (!category) {
      return
    }

    setEditingId(category.id)
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
      toast.success("Illness category deleted.")

      if (editingId === deleteTarget.uuid) {
        resetForm()
      }

      setDeleteTarget(null)
    } catch {
      toast.error("Failed to delete illness category.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="w-full space-y-6 p-4 md:p-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="space-y-1">
          <h1 className="font-heading text-2xl font-semibold">Illness Categories</h1>
          <p className="text-sm text-muted-foreground">
            Add, review, update, and remove the medical categories used during appointment booking.
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
            placeholder="Search category or description..."
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-4xl border border-sidebar-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Categories</p>
          <p className="mt-2 text-3xl font-semibold">{illnessCategories.length}</p>
        </div>
        <div className="rounded-4xl border border-sidebar-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Shown Results</p>
          <p className="mt-2 text-3xl font-semibold">{filteredCategories.length}</p>
        </div>
        <div className="rounded-4xl border border-sidebar-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">With Descriptions</p>
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
              <label className="text-sm font-medium">Category Name</label>
              <Input
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({ ...current, name: event.target.value }))
                }
                placeholder="Example: Dermatology"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({ ...current, description: event.target.value }))
                }
                placeholder="Short explanation about what this illness category covers."
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={handleSubmit} disabled={!isFormValid || isSaving} className="rounded-2xl">
                <HugeiconsIcon icon={editingId ? Edit02Icon : PlusSignIcon} strokeWidth={1.8} />
                {isSaving ? "Saving..." : editingId ? "Update Category" : "Add Category"}
              </Button>
              <Button
                variant="outline"
                onClick={resetForm}
                disabled={isSaving || (!editingId && !form.name && !form.description)}
                className="rounded-2xl"
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-sidebar-border py-5 shadow-sm">
          <CardHeader className="border-b border-sidebar-border">
            <CardTitle>Category Directory</CardTitle>
            <CardDescription>
              Every illness category currently available in the appointment system.
            </CardDescription>
          </CardHeader>

          <CardContent className="py-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                      No illness categories match your search yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((category) => (
                    <TableRow key={category.id}>
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
                          {category.description?.trim() || "No description provided."}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {category.id.slice(0, 8).toUpperCase()}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-2xl"
                            onClick={() => handleEdit(category.id)}
                          >
                            <HugeiconsIcon icon={Edit02Icon} strokeWidth={1.8} />
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="rounded-2xl"
                            onClick={() =>
                              setDeleteTarget({
                                uuid: category.id,
                                name: category.name,
                              })
                            }
                          >
                            <HugeiconsIcon icon={Delete02Icon} strokeWidth={1.8} />
                            Delete
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
            <DialogTitle>Delete Illness Category</DialogTitle>
            <DialogDescription>
              {deleteTarget
                ? `This will permanently remove "${deleteTarget.name}" from the system.`
                : "This action will permanently remove the selected illness category."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
