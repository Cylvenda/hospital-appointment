"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import { Medicine01Icon } from "@hugeicons/core-free-icons"
import { Plus, Pencil, Trash2, Search } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useLaboratoryStore } from "@/store/laboratory/laboratory.store"
import { toast } from "react-toastify"
import type { LabTestType } from "@/store/laboratory/laboratory.types"
import { useTranslation } from "@/lib/i18n"

export default function TestTypesPage() {
     const { t } = useTranslation()
    const { 
        testTypes, 
        loading, 
        fetchTestTypes, 
        createTestType, 
        updateTestType, 
        deleteTestType 
    } = useLaboratoryStore()

    const [searchQuery, setSearchQuery] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingType, setEditingType] = useState<LabTestType | null>(null)
    const [submitting, setSubmitting] = useState(false)

    // Form state
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [isActive, setIsActive] = useState(true)

    useEffect(() => {
        fetchTestTypes()
    }, [fetchTestTypes])

    const filteredTypes = testTypes.filter(t => 
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleOpenDialog = (type?: LabTestType) => {
        if (type) {
            setEditingType(type)
            setName(type.name)
            setDescription(type.description)
            setIsActive(type.isActive)
        } else {
            setEditingType(null)
            setName("")
            setDescription("")
            setIsActive(true)
        }
        setIsDialogOpen(true)
    }

    const handleCloseDialog = () => {
        setIsDialogOpen(false)
        setEditingType(null)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            const payload = {
                name,
                description,
                is_active: isActive
            }

            if (editingType) {
                await updateTestType(editingType.id, payload)
                 toast.success(t("labTech.testTypeUpdated"))
             } else {
                 await createTestType(payload)
                 toast.success(t("labTech.testTypeCreated"))
             }
            handleCloseDialog()
        } catch (error: unknown) {
             toast.error(error instanceof Error ? error.message : t("common.error"))
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (id: string) => {
         if (!window.confirm(t("labTech.deleteConfirm"))) return
         try {
             await deleteTestType(id)
             toast.success(t("labTech.testTypeDeleted"))
        } catch (error: unknown) {
             toast.error(error instanceof Error ? error.message : t("common.error"))
        }
    }

    const handleToggleActive = async (type: LabTestType, checked: boolean) => {
        try {
            await updateTestType(type.id, { is_active: checked })
             toast.success(t("labTech.testTypeUpdated"))
        } catch (error: unknown) {
             toast.error(error instanceof Error ? error.message : t("common.error"))
        }
    }

    return (
        <motion.div 
            className="mx-auto w-full max-w-8xl space-y-8 p-4 md:p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                         <HugeiconsIcon icon={Medicine01Icon} className="w-8 h-8 text-primary" />
                         {t("labTech.labTestTypes")}
                     </h1>
                     <p className="text-muted-foreground mt-1">
                         {t("labTech.comprehensiveList")}
                     </p>
                 </div>
                 <Button onClick={() => handleOpenDialog()} className="gap-2">
                     <Plus className="w-4 h-4" />
                     {t("labTech.addTestType")}
                 </Button>
            </div>

            <Card className="shadow-sm border-muted/40">
                <CardHeader className="bg-muted/10 pb-4 border-b border-muted/20">
                    <div className="flex items-center justify-between">
                        <div>
                             <CardTitle className="text-lg font-semibold flex items-center gap-2 text-primary">
                                 {t("labTech.testTypes")}
                             </CardTitle>
                             <CardDescription>
                                 {t("labTech.comprehensiveList")}
                             </CardDescription>
                        </div>
                        <div className="relative w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                             <Input
                                 type="text"
                                 placeholder={t("labTech.searchTests")}
                                 className="pl-9"
                                 value={searchQuery}
                                 onChange={(e) => setSearchQuery(e.target.value)}
                             />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                             <TableHeader>
                                 <TableRow>
                                     <TableHead className="w-[250px]">{t("labTech.testName")}</TableHead>
                                     <TableHead>{t("labTech.description")}</TableHead>
                                     <TableHead className="w-[100px] text-center">{t("labTech.status")}</TableHead>
                                     <TableHead className="w-[100px] text-right">{t("labTech.actions")}</TableHead>
                                 </TableRow>
                             </TableHeader>
                        <TableBody>
                            {loading && testTypes.length === 0 ? (
                                <TableRow>
                                     <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                         {t("labTech.loadingTestTypes")}
                                     </TableCell>
                                </TableRow>
                            ) : filteredTypes.length === 0 ? (
                                <TableRow>
                                     <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                         {t("labTech.noTestTypesFound")}
                                     </TableCell>
                                </TableRow>
                            ) : (
                                filteredTypes.map((type) => (
                                    <TableRow key={type.id}>
                                        <TableCell className="font-medium">{type.name}</TableCell>
                                        <TableCell className="text-muted-foreground truncate max-w-[300px]" title={type.description}>
                                            {type.description || "-"}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex justify-center items-center gap-2">
                                                <Switch 
                                                    checked={type.isActive} 
                                                    onCheckedChange={(checked) => handleToggleActive(type, checked)}
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end items-center gap-2">
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    onClick={() => handleOpenDialog(type)}
                                                >
                                                    <Pencil className="w-4 h-4 text-muted-foreground" />
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    onClick={() => handleDelete(type.id)}
                                                >
                                                    <Trash2 className="w-4 h-4 text-destructive" />
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

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleSubmit}>
                         <DialogHeader>
                             <DialogTitle>{editingType ? t("labTech.edit") : t("labTech.add")}</DialogTitle>
                         </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                 <Label htmlFor="name">{t("labTech.testNameRequired")} <span className="text-destructive">*</span></Label>
                                 <Input
                                     id="name"
                                     value={name}
                                     onChange={(e) => setName(e.target.value)}
                                     placeholder="e.g. Complete Blood Count (CBC)"
                                     required
                                 />
                             </div>
                             <div className="grid gap-2">
                                 <Label htmlFor="description">{t("labTech.description")}</Label>
                                 <Textarea
                                     id="description"
                                     value={description}
                                     onChange={(e) => setDescription(e.target.value)}
                                     placeholder={t("labTech.optionalDescription")}
                                     rows={3}
                                 />
                             </div>
                             <div className="flex items-center space-x-2 mt-2">
                                 <Switch
                                     id="active"
                                     checked={isActive}
                                     onCheckedChange={setIsActive}
                                 />
                                 <Label htmlFor="active" className="cursor-pointer">{t("labTech.active")}</Label>
                             </div>
                        </div>
                        <DialogFooter>
                             <Button type="button" variant="outline" onClick={handleCloseDialog} disabled={submitting}>
                                 {t("labTech.cancel")}
                             </Button>
                             <Button type="submit" disabled={submitting}>
                                 {submitting ? t("labTech.saving") : t("labTech.save")}
                             </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </motion.div>
    )
}
