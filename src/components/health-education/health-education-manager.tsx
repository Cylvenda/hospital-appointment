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

export function HealthEducationManager() {
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
    const [file, setFile] = useState<File | null>(null)

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
        setFile(null)
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
            setFile(null)
            setIsEditOpen(true)
        } catch (error) {
            toast.error("Failed to fetch full content details")
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
            toast.error("Category name is required")
            return
        }

        setIsSubmitting(true)
        try {
            await createCategory({ name: categoryName, description: categoryDescription })
            toast.success("Category created successfully")
            setIsCategoryOpen(false)
            resetCategoryForm()
        } catch (error: any) {
            toast.error(error || "Failed to create category")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleUpdateCategory = async () => {
        if (!selectedCategory || !categoryName) return

        setIsSubmitting(true)
        try {
            await updateCategory(selectedCategory.slug, { name: categoryName, description: categoryDescription })
            toast.success("Category updated successfully")
            setIsEditCategoryOpen(false)
            resetCategoryForm()
        } catch (error: any) {
            toast.error(error || "Failed to update category")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteCategory = async () => {
        if (!selectedCategory) return

        setIsSubmitting(true)
        try {
            await deleteCategory(selectedCategory.slug)
            toast.success("Category deleted successfully")
            setIsDeleteCategoryOpen(false)
            resetCategoryForm()
        } catch (error: any) {
            toast.error(error || "Failed to delete category")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCreate = async () => {
        if (!title || !categoryId) {
            toast.error("Title and Category are required")
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
            if (file) {
                formData.append("featured_image", file)
            }

            await createContent(formData)
            toast.success("Content created successfully")
            setIsAddOpen(false)
            resetForm()
        } catch (error: any) {
            toast.error(error || "Failed to create content")
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
            if (file) {
                formData.append("featured_image", file)
            }

            await updateContent(selectedContent.slug, formData)
            toast.success("Content updated successfully")
            setIsEditOpen(false)
            resetForm()
        } catch (error: any) {
            toast.error(error || "Failed to update content")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async () => {
        if (!selectedContent) return

        setIsSubmitting(true)
        try {
            await deleteContent(selectedContent.slug)
            toast.success("Content deleted successfully")
            setIsDeleteOpen(false)
            resetForm()
        } catch (error: any) {
            toast.error(error || "Failed to delete content")
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
                        <HugeiconsIcon icon={Book01Icon} className="w-8 h-8 text-primary" />
                        Manage Health Education
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Publish and edit articles, videos, and FAQs for patients.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => { resetCategoryForm(); setIsCategoryOpen(true); }} className="gap-2">
                        <HugeiconsIcon icon={Add01Icon} className="w-4 h-4" />
                        New Category
                    </Button>
                    <Button onClick={() => { resetForm(); setIsAddOpen(true); }} className="gap-2">
                        <HugeiconsIcon icon={Add01Icon} className="w-4 h-4" />
                        Publish Content
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="contents" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="contents">Contents</TabsTrigger>
                    <TabsTrigger value="categories">Categories</TabsTrigger>
                </TabsList>
                
                <TabsContent value="contents" className="mt-0">
                    <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading && contents.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    Loading contents...
                                </TableCell>
                            </TableRow>
                        ) : contents.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    No contents found. Add a new one to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            contents.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-semibold max-w-[200px] truncate">{item.title}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{item.category.name}</Badge>
                                    </TableCell>
                                    <TableCell>{item.contentType}</TableCell>
                                    <TableCell>
                                        <Badge variant={item.status === "PUBLISHED" ? "default" : item.status === "DRAFT" ? "secondary" : "destructive"}>
                                            {item.status}
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
                                    <TableHead>Category Name</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading && categories.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                            Loading categories...
                                        </TableCell>
                                    </TableRow>
                                ) : categories.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                            No categories found. Add a new one to get started.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    categories.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-semibold">{item.name}</TableCell>
                                            <TableCell className="text-muted-foreground truncate max-w-[300px]">{item.description || "N/A"}</TableCell>
                                            <TableCell>
                                                <Badge variant={item.isActive ? "default" : "secondary"}>
                                                    {item.isActive ? "Active" : "Inactive"}
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
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Publish New Content</DialogTitle>
                        <DialogDescription>Create an article, video link, or FAQ for patients.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Title</label>
                            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. How to manage Hypertension" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold">Category</label>
                                <Select value={categoryId} onValueChange={setCategoryId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold">Content Type</label>
                                <Select value={contentType} onValueChange={setContentType}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ARTICLE">Article</SelectItem>
                                        <SelectItem value="VIDEO">Video</SelectItem>
                                        <SelectItem value="INFOGRAPHIC">Infographic</SelectItem>
                                        <SelectItem value="FAQ">FAQ</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Status</label>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="DRAFT">Draft</SelectItem>
                                    <SelectItem value="PUBLISHED">Published</SelectItem>
                                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Summary</label>
                            <Textarea value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Brief summary for cards..." />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Full Content (HTML allowed)</label>
                            <Textarea value={content} onChange={(e) => setContentText(e.target.value)} className="min-h-[200px]" placeholder="<p>Article content goes here...</p>" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Featured Image</label>
                            <Input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} accept="image/jpeg, image/png, image/webp" />
                            <p className="text-xs text-muted-foreground mt-1">Required format: JPG, PNG, WEBP. Max size: 5MB.</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddOpen(false)} disabled={isSubmitting}>Cancel</Button>
                        <Button onClick={handleCreate} disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Publish"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Content</DialogTitle>
                        <DialogDescription>Update the details of the health education content.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Title</label>
                            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. How to manage Hypertension" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold">Category</label>
                                <Select value={categoryId} onValueChange={setCategoryId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold">Content Type</label>
                                <Select value={contentType} onValueChange={setContentType}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ARTICLE">Article</SelectItem>
                                        <SelectItem value="VIDEO">Video</SelectItem>
                                        <SelectItem value="INFOGRAPHIC">Infographic</SelectItem>
                                        <SelectItem value="FAQ">FAQ</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Status</label>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="DRAFT">Draft</SelectItem>
                                    <SelectItem value="PUBLISHED">Published</SelectItem>
                                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Summary</label>
                            <Textarea value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Brief summary for cards..." />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Full Content (HTML allowed)</label>
                            <Textarea value={content} onChange={(e) => setContentText(e.target.value)} className="min-h-[200px]" placeholder="<p>Article content goes here...</p>" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Replace Featured Image</label>
                            <Input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} accept="image/jpeg, image/png, image/webp" />
                            <p className="text-xs text-muted-foreground mt-1">Required format: JPG, PNG, WEBP. Max size: 5MB.</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditOpen(false)} disabled={isSubmitting}>Cancel</Button>
                        <Button onClick={handleUpdate} disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Update"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Content</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete <strong>{selectedContent?.title}</strong>? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setIsDeleteOpen(false)} disabled={isSubmitting}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting}>{isSubmitting ? "Deleting..." : "Delete"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Category Dialog */}
            <Dialog open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>New Category</DialogTitle>
                        <DialogDescription>
                            Create a new category for health education content.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Category Name</label>
                            <Input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder="e.g. Mental Health" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Description</label>
                            <Textarea value={categoryDescription} onChange={(e) => setCategoryDescription(e.target.value)} placeholder="Brief description of this category..." />
                        </div>
                    </div>
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setIsCategoryOpen(false)} disabled={isSubmitting}>Cancel</Button>
                        <Button onClick={handleCreateCategory} disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Create Category"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Category Dialog */}
            <Dialog open={isEditCategoryOpen} onOpenChange={setIsEditCategoryOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Category</DialogTitle>
                        <DialogDescription>
                            Update the details of the health education category.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Category Name</label>
                            <Input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder="e.g. Mental Health" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Description</label>
                            <Textarea value={categoryDescription} onChange={(e) => setCategoryDescription(e.target.value)} placeholder="Brief description of this category..." />
                        </div>
                    </div>
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setIsEditCategoryOpen(false)} disabled={isSubmitting}>Cancel</Button>
                        <Button onClick={handleUpdateCategory} disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Update Category"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Category Dialog */}
            <Dialog open={isDeleteCategoryOpen} onOpenChange={setIsDeleteCategoryOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Category</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete <strong>{selectedCategory?.name}</strong>? This will remove the category. Content under this category may become uncategorized. This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setIsDeleteCategoryOpen(false)} disabled={isSubmitting}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDeleteCategory} disabled={isSubmitting}>{isSubmitting ? "Deleting..." : "Delete Category"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </motion.div>
    )
}
