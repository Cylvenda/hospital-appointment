"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import { Book01Icon, Add01Icon, Edit02Icon, Delete01Icon, ViewIcon } from "@hugeicons/core-free-icons"
import { toast } from "react-toastify"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useHealthEducationStore } from "@/store/health-education/health-education.store"
import { healthEducationService } from "@/api/services/health-education.service"
import type { EducationalContent, ContentCategory } from "@/store/health-education/health-education.types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTranslation } from "@/lib/i18n"

function errorMessage(error: unknown, fallback: string) {
    return error instanceof Error && error.message ? error.message : fallback
}

export function HealthEducationManager() {
    const { t } = useTranslation()
    const { contents, categories, loading, fetchContents, fetchCategories, createContent, updateContent, deleteContent, createCategory, updateCategory, deleteCategory } = useHealthEducationStore()
    
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [isCategoryOpen, setIsCategoryOpen] = useState(false)
    const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false)
    const [isDeleteCategoryOpen, setIsDeleteCategoryOpen] = useState(false)
    const [selectedContent, setSelectedContent] = useState<EducationalContent | null>(null)
    const [selectedCategory, setSelectedCategory] = useState<ContentCategory | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form state for content
    const [title, setTitle] = useState("")
    const [summary, setSummary] = useState("")
    const [content, setContentText] = useState("")
    const [categoryId, setCategoryId] = useState("")
    const [contentType, setContentType] = useState("ARTICLE")
    const [status, setStatus] = useState("DRAFT")
    const [featuredImage, setFeaturedImage] = useState<File | null>(null)
    const [videoFile, setVideoFile] = useState<File | null>(null)

    // Form state for category
    const [categoryName, setCategoryName] = useState("")
    const [categoryDescription, setCategoryDescription] = useState("")

    useEffect(() => {
        void fetchContents()
        void fetchCategories()
    }, [fetchContents, fetchCategories])

    const resetForm = () => {
        setTitle("")
        setSummary("")
        setContentText("")
        setCategoryId("")
        setContentType("ARTICLE")
        setStatus("DRAFT")
        setFeaturedImage(null)
        setVideoFile(null)
        setSelectedContent(null)
    }

    const resetCategoryForm = () => {
        setCategoryName("")
        setCategoryDescription("")
        setSelectedCategory(null)
    }

    const openEditDialog = async (item: EducationalContent) => {
        setIsSubmitting(true)
        try {
            // Fetch the full details because the list API does not return the full 'content' HTML
            const response = await healthEducationService.getContentBySlug(item.slug)
            const fullContent = response.data

            setSelectedContent(item)
            setTitle(fullContent.title)
            setSummary(fullContent.summary)
            setContentText(fullContent.content || "")
            setCategoryId(fullContent.category.uuid)
            setContentType(fullContent.content_type)
            setStatus(fullContent.status)
            setFeaturedImage(null)
            setVideoFile(null)
            setIsEditOpen(true)
        } catch {
            toast.error(t("healthEducation.fetchContentDetailsError"))
        } finally {
            setIsSubmitting(false)
        }
    }

    const openDeleteDialog = (item: EducationalContent) => {
        setSelectedContent(item)
        setIsDeleteOpen(true)
    }

    const handleCreateCategory = async () => {
        if (!categoryName) {
            toast.error(t("healthEducation.categoryNameRequired"))
            return
        }

        setIsSubmitting(true)
        try {
            await createCategory({ name: categoryName, description: categoryDescription })
            toast.success(t("healthEducation.categoryCreated"))
            setIsCategoryOpen(false)
            resetCategoryForm()
        } catch (error: unknown) {
            toast.error(errorMessage(error, t("healthEducation.categoryCreateError")))
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleUpdateCategory = async () => {
        if (!selectedCategory || !categoryName) return

        setIsSubmitting(true)
        try {
            await updateCategory(selectedCategory.slug, { name: categoryName, description: categoryDescription })
            toast.success(t("healthEducation.categoryUpdated"))
            setIsEditCategoryOpen(false)
            resetCategoryForm()
        } catch (error: unknown) {
            toast.error(errorMessage(error, t("healthEducation.categoryUpdateError")))
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteCategory = async () => {
        if (!selectedCategory) return

        setIsSubmitting(true)
        try {
            await deleteCategory(selectedCategory.slug)
            toast.success(t("healthEducation.categoryDeleted"))
            setIsDeleteCategoryOpen(false)
            resetCategoryForm()
        } catch (error: unknown) {
            toast.error(errorMessage(error, t("healthEducation.categoryDeleteError")))
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCreate = async () => {
        if (!title || !categoryId) {
            toast.error(t("healthEducation.titleCategoryRequired"))
            return
        }

        setIsSubmitting(true)
        try {
            const formData = new FormData()
            formData.append("title", title)
            formData.append("summary", summary)
            formData.append("content", content)
            formData.append("category_uuid", categoryId)
            formData.append("content_type", contentType)
            formData.append("status", status)
            if (featuredImage) {
                formData.append("featured_image", featuredImage)
            }
            if (videoFile) {
                formData.append("video_file", videoFile)
            }

            await createContent(formData)
            toast.success(t("healthEducation.contentCreated"))
            setIsAddOpen(false)
            resetForm()
        } catch (error: unknown) {
            toast.error(errorMessage(error, t("healthEducation.contentCreateError")))
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleUpdate = async () => {
        if (!selectedContent || !title || !categoryId) return

        setIsSubmitting(true)
        try {
            const formData = new FormData()
            formData.append("title", title)
            formData.append("summary", summary)
            formData.append("content", content)
            formData.append("category_uuid", categoryId)
            formData.append("content_type", contentType)
            formData.append("status", status)
            if (featuredImage) {
                formData.append("featured_image", featuredImage)
            }
            if (videoFile) {
                formData.append("video_file", videoFile)
            }

            await updateContent(selectedContent.slug, formData)
            toast.success(t("healthEducation.contentUpdated"))
            setIsEditOpen(false)
            resetForm()
        } catch (error: unknown) {
            toast.error(errorMessage(error, t("healthEducation.contentUpdateError")))
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async () => {
        if (!selectedContent) return

        setIsSubmitting(true)
        try {
            await deleteContent(selectedContent.slug)
            toast.success(t("healthEducation.contentDeleted"))
            setIsDeleteOpen(false)
            resetForm()
        } catch (error: unknown) {
            toast.error(errorMessage(error, t("healthEducation.contentDeleteError")))
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <motion.div 
            className="w-full space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <HugeiconsIcon icon={Book01Icon} className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 text-primary" />
                        {t("healthEducation.title")}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {t("healthEducation.subtitle")}
                    </p>
                </div>
                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
                    <Button variant="outline" onClick={() => { resetCategoryForm(); setIsCategoryOpen(true); }} className="w-full gap-2 sm:w-auto">
                        <HugeiconsIcon icon={Add01Icon} className="w-4 h-4" />
                        {t("healthEducation.newCategory")}
                    </Button>
                    <Button onClick={() => { resetForm(); setIsAddOpen(true); }} className="w-full gap-2 sm:w-auto">
                        <HugeiconsIcon icon={Add01Icon} className="w-4 h-4" />
                        {t("healthEducation.publishContent")}
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="contents" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="contents">{t("healthEducation.contentsTab")}</TabsTrigger>
                    <TabsTrigger value="categories">{t("healthEducation.categoriesTab")}</TabsTrigger>
                </TabsList>
                
                <TabsContent value="contents" className="mt-0">
                    <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead>{t("healthEducation.table.title")}</TableHead>
                            <TableHead>{t("healthEducation.table.category")}</TableHead>
                            <TableHead>{t("healthEducation.table.type")}</TableHead>
                            <TableHead>{t("common.status")}</TableHead>
                            <TableHead className="text-right">{t("common.actions")}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading && contents.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    {t("healthEducation.loadingContents")}
                                </TableCell>
                            </TableRow>
                        ) : contents.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    {t("healthEducation.noContents")}
                                </TableCell>
                            </TableRow>
                        ) : (
                            contents.map((item) => (
                                <TableRow key={item.id}>
	                                    <TableCell className="font-semibold min-w-[180px] max-w-[220px] truncate">{item.title}</TableCell>
                                    <TableCell>
	                                        <Badge variant="outline" className="max-w-[180px] truncate">{item.category.name}</Badge>
                                    </TableCell>
                                    <TableCell>{t(`healthEducation.contentTypes.${item.contentType}`)}</TableCell>
                                    <TableCell>
                                        <Badge variant={item.status === "PUBLISHED" ? "default" : item.status === "DRAFT" ? "secondary" : "destructive"}>
                                            {t(`healthEducation.statuses.${item.status}`)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="outline" size="icon" asChild>
                                                <Link href={`/patient-dashboard/health-education/${item.slug}`} target="_blank">
                                                    <HugeiconsIcon icon={ViewIcon} className="w-4 h-4" />
                                                </Link>
                                            </Button>
                                            <Button variant="outline" size="icon" onClick={() => openEditDialog(item)}>
                                                <HugeiconsIcon icon={Edit02Icon} className="w-4 h-4" />
                                            </Button>
                                            <Button variant="outline" size="icon" className="text-rose-600 border-rose-200 hover:bg-rose-50" onClick={() => openDeleteDialog(item)}>
                                                <HugeiconsIcon icon={Delete01Icon} className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
                </TabsContent>

                <TabsContent value="categories" className="mt-0">
                    <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead>{t("healthEducation.categoryName")}</TableHead>
                                    <TableHead>{t("common.description")}</TableHead>
                                    <TableHead>{t("common.status")}</TableHead>
                                    <TableHead className="text-right">{t("common.actions")}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading && categories.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                            {t("healthEducation.loadingCategories")}
                                        </TableCell>
                                    </TableRow>
                                ) : categories.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                            {t("healthEducation.noCategories")}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    categories.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-semibold min-w-[160px] max-w-[220px] truncate">{item.name}</TableCell>
                                            <TableCell className="text-muted-foreground truncate min-w-[220px] max-w-[320px]">{item.description || t("healthEducation.na")}</TableCell>
                                            <TableCell>
                                                <Badge variant={item.isActive ? "default" : "secondary"}>
                                                    {item.isActive ? t("search.active") : t("search.inactive")}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="outline" size="icon" onClick={() => {
                                                        setSelectedCategory(item)
                                                        setCategoryName(item.name)
                                                        setCategoryDescription(item.description || "")
                                                        setIsEditCategoryOpen(true)
                                                    }}>
                                                        <HugeiconsIcon icon={Edit02Icon} className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="outline" size="icon" className="text-rose-600 border-rose-200 hover:bg-rose-50" onClick={() => {
                                                        setSelectedCategory(item)
                                                        setIsDeleteCategoryOpen(true)
                                                    }}>
                                                        <HugeiconsIcon icon={Delete01Icon} className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Add Dialog */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="max-h-[92vh] overflow-y-auto p-4 sm:max-w-2xl sm:p-6">
                    <DialogHeader>
                        <DialogTitle>{t("healthEducation.publishNewContent")}</DialogTitle>
                        <DialogDescription>{t("healthEducation.publishNewContentDescription")}</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">{t("healthEducation.table.title")}</label>
                            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t("healthEducation.titlePlaceholder")} />
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold">{t("healthEducation.table.category")}</label>
                                <Select value={categoryId} onValueChange={setCategoryId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t("healthEducation.selectCategory")} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold">{t("healthEducation.table.type")}</label>
                                <Select value={contentType} onValueChange={setContentType}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ARTICLE">{t("healthEducation.contentTypes.ARTICLE")}</SelectItem>
                                        <SelectItem value="VIDEO">{t("healthEducation.contentTypes.VIDEO")}</SelectItem>
                                        <SelectItem value="INFOGRAPHIC">{t("healthEducation.contentTypes.INFOGRAPHIC")}</SelectItem>
                                        <SelectItem value="FAQ">{t("healthEducation.contentTypes.FAQ")}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">{t("common.status")}</label>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="DRAFT">{t("healthEducation.statuses.DRAFT")}</SelectItem>
                                    <SelectItem value="PUBLISHED">{t("healthEducation.statuses.PUBLISHED")}</SelectItem>
                                    <SelectItem value="ARCHIVED">{t("healthEducation.statuses.ARCHIVED")}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">{t("healthEducation.summary")}</label>
                            <Textarea value={summary} onChange={(e) => setSummary(e.target.value)} placeholder={t("healthEducation.summaryPlaceholder")} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">{t("healthEducation.fullContent")}</label>
                            <Textarea value={content} onChange={(e) => setContentText(e.target.value)} className="min-h-[200px]" placeholder={t("healthEducation.contentPlaceholder")} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">{t("healthEducation.featuredImage")}</label>
                            <Input type="file" onChange={(e) => setFeaturedImage(e.target.files?.[0] || null)} accept="image/jpeg, image/png, image/webp" />
                            <p className="text-xs text-muted-foreground mt-1">{t("healthEducation.imageHelp")}</p>
                        </div>
                        {contentType === "VIDEO" && (
                            <div className="space-y-2">
                                <label className="text-sm font-semibold">{t("healthEducation.videoFile")}</label>
                                <Input type="file" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} accept="video/mp4, video/quicktime, video/webm, .m4v" />
                                <p className="text-xs text-muted-foreground mt-1">{t("healthEducation.videoHelp")}</p>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddOpen(false)} disabled={isSubmitting}>{t("common.cancel")}</Button>
                        <Button onClick={handleCreate} disabled={isSubmitting}>{isSubmitting ? t("profile.saving") : t("healthEducation.publish")}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-h-[92vh] overflow-y-auto p-4 sm:max-w-2xl sm:p-6">
                    <DialogHeader>
                        <DialogTitle>{t("healthEducation.editContent")}</DialogTitle>
                        <DialogDescription>{t("healthEducation.editContentDescription")}</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">{t("healthEducation.table.title")}</label>
                            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t("healthEducation.titlePlaceholder")} />
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold">{t("healthEducation.table.category")}</label>
                                <Select value={categoryId} onValueChange={setCategoryId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t("healthEducation.selectCategory")} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold">{t("healthEducation.table.type")}</label>
                                <Select value={contentType} onValueChange={setContentType}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ARTICLE">{t("healthEducation.contentTypes.ARTICLE")}</SelectItem>
                                        <SelectItem value="VIDEO">{t("healthEducation.contentTypes.VIDEO")}</SelectItem>
                                        <SelectItem value="INFOGRAPHIC">{t("healthEducation.contentTypes.INFOGRAPHIC")}</SelectItem>
                                        <SelectItem value="FAQ">{t("healthEducation.contentTypes.FAQ")}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">{t("common.status")}</label>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="DRAFT">{t("healthEducation.statuses.DRAFT")}</SelectItem>
                                    <SelectItem value="PUBLISHED">{t("healthEducation.statuses.PUBLISHED")}</SelectItem>
                                    <SelectItem value="ARCHIVED">{t("healthEducation.statuses.ARCHIVED")}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">{t("healthEducation.summary")}</label>
                            <Textarea value={summary} onChange={(e) => setSummary(e.target.value)} placeholder={t("healthEducation.summaryPlaceholder")} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">{t("healthEducation.fullContent")}</label>
                            <Textarea value={content} onChange={(e) => setContentText(e.target.value)} className="min-h-[200px]" placeholder={t("healthEducation.contentPlaceholder")} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">{t("healthEducation.replaceFeaturedImage")}</label>
                            <Input type="file" onChange={(e) => setFeaturedImage(e.target.files?.[0] || null)} accept="image/jpeg, image/png, image/webp" />
                            <p className="text-xs text-muted-foreground mt-1">{t("healthEducation.imageHelp")}</p>
                        </div>
                        {contentType === "VIDEO" && (
                            <div className="space-y-2">
                                <label className="text-sm font-semibold">{t("healthEducation.replaceVideoFile")}</label>
                                <Input type="file" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} accept="video/mp4, video/quicktime, video/webm, .m4v" />
                                <p className="text-xs text-muted-foreground mt-1">{t("healthEducation.videoHelp")}</p>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditOpen(false)} disabled={isSubmitting}>{t("common.cancel")}</Button>
                        <Button onClick={handleUpdate} disabled={isSubmitting}>{isSubmitting ? t("profile.saving") : t("common.update")}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t("healthEducation.deleteContent")}</DialogTitle>
                        <DialogDescription>
                            {t("healthEducation.deleteContentDescription", {
                              title: selectedContent?.title || "",
                            })}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setIsDeleteOpen(false)} disabled={isSubmitting}>{t("common.cancel")}</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting}>{isSubmitting ? t("healthEducation.deleting") : t("common.delete")}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Category Dialog */}
            <Dialog open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t("healthEducation.newCategory")}</DialogTitle>
                        <DialogDescription>
                            {t("healthEducation.newCategoryDescription")}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">{t("healthEducation.categoryName")}</label>
                            <Input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder={t("healthEducation.categoryNamePlaceholder")} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">{t("common.description")}</label>
                            <Textarea value={categoryDescription} onChange={(e) => setCategoryDescription(e.target.value)} placeholder={t("healthEducation.categoryDescriptionPlaceholder")} />
                        </div>
                    </div>
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setIsCategoryOpen(false)} disabled={isSubmitting}>{t("common.cancel")}</Button>
                        <Button onClick={handleCreateCategory} disabled={isSubmitting}>{isSubmitting ? t("healthEducation.creating") : t("healthEducation.createCategory")}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Category Dialog */}
            <Dialog open={isEditCategoryOpen} onOpenChange={setIsEditCategoryOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t("healthEducation.editCategory")}</DialogTitle>
                        <DialogDescription>
                            {t("healthEducation.editCategoryDescription")}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">{t("healthEducation.categoryName")}</label>
                            <Input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder={t("healthEducation.categoryNamePlaceholder")} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">{t("common.description")}</label>
                            <Textarea value={categoryDescription} onChange={(e) => setCategoryDescription(e.target.value)} placeholder={t("healthEducation.categoryDescriptionPlaceholder")} />
                        </div>
                    </div>
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setIsEditCategoryOpen(false)} disabled={isSubmitting}>{t("common.cancel")}</Button>
                        <Button onClick={handleUpdateCategory} disabled={isSubmitting}>{isSubmitting ? t("profile.saving") : t("healthEducation.updateCategory")}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Category Dialog */}
            <Dialog open={isDeleteCategoryOpen} onOpenChange={setIsDeleteCategoryOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t("healthEducation.deleteCategory")}</DialogTitle>
                        <DialogDescription>
                            {t("healthEducation.deleteCategoryDescription", {
                              name: selectedCategory?.name || "",
                            })}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setIsDeleteCategoryOpen(false)} disabled={isSubmitting}>{t("common.cancel")}</Button>
                        <Button variant="destructive" onClick={handleDeleteCategory} disabled={isSubmitting}>{isSubmitting ? t("healthEducation.deleting") : t("healthEducation.deleteCategory")}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </motion.div>
    )
}
