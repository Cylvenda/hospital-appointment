"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft01Icon, Time01Icon, UserAccountIcon, FavouriteIcon, ThumbsUpIcon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { healthEducationService } from "@/api/services/health-education.service"
import type { EducationalContentApi } from "@/store/health-education/health-education.types"
import { mapContent } from "@/store/health-education/health-education.store"
import type { EducationalContent } from "@/store/health-education/health-education.types"
import { useHealthEducationStore } from "@/store/health-education/health-education.store"
import { toast } from "react-toastify"
import { formatPublishedDate } from "@/lib/format-published-date"

export default function ArticleDetailPage() {
    const params = useParams()
    const router = useRouter()
    const slug = params.slug as string
    
    const [article, setArticle] = useState<EducationalContent | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    
    const { bookmarks, toggleBookmark } = useHealthEducationStore()
    const isBookmarked = bookmarks.some(b => b.content.slug === slug)

    useEffect(() => {
        async function fetchArticle() {
            try {
                const response = await healthEducationService.getContentBySlug(slug)
                setArticle(mapContent(response.data))
            } catch (err: any) {
                setError("Failed to load article. It may have been removed.")
            } finally {
                setLoading(false)
            }
        }
        
        if (slug) {
            void fetchArticle()
        }
    }, [slug])

    const handleBookmark = async () => {
        try {
            await toggleBookmark(slug)
            toast.success(isBookmarked ? "Removed from bookmarks" : "Saved to bookmarks")
        } catch (err) {
            toast.error("Failed to update bookmark")
        }
    }

    const handleReaction = async (type: "LIKE" | "HELPFUL") => {
        try {
            const res = await healthEducationService.toggleReaction(slug, type)
            toast.success(res.data.status === "reaction updated" ? `Marked as ${type.toLowerCase()}` : "Reaction removed")
        } catch (err) {
            toast.error("Failed to record reaction")
        }
    }

    if (loading) {
        return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading article details...</div>
    }

    if (error || !article) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-xl font-bold text-destructive">Error</h2>
                <p className="text-muted-foreground mt-2">{error}</p>
                <Button variant="outline" className="mt-4" onClick={() => router.back()}>Go Back</Button>
            </div>
        )
    }

    return (
        <motion.div 
            className="w-full max-w-4xl mx-auto space-y-8 p-4 md:p-8 pb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <Button variant="ghost" className="gap-2 -ml-4 text-muted-foreground hover:text-foreground" onClick={() => router.back()}>
                <HugeiconsIcon icon={ArrowLeft01Icon} className="w-4 h-4" />
                Back to Education
            </Button>

            <article className="space-y-8">
                <header className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20">{article.category.name}</Badge>
                        {article.tags.map(tag => (
                            <Badge key={tag.id} variant="outline" className="text-muted-foreground">{tag.name}</Badge>
                        ))}
                    </div>
                    
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
                        {article.title}
                    </h1>
                    
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        {article.summary}
                    </p>

                    <div className="flex items-center justify-between pt-4">
                        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-2">
                                <HugeiconsIcon icon={UserAccountIcon} className="w-4 h-4" />
                                Written by {article.authorName}
                            </span>
                            <span className="flex items-center gap-2">
                                <HugeiconsIcon icon={Time01Icon} className="w-4 h-4" />
                                Published on {formatPublishedDate(article.publishedAt, article.createdAt, { month: "long", day: "numeric", year: "numeric" })}
                            </span>
                        </div>
                        
                        <Button 
                            variant={isBookmarked ? "default" : "outline"} 
                            className="gap-2 rounded-full"
                            onClick={handleBookmark}
                        >
                            <HugeiconsIcon icon={FavouriteIcon} className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                            {isBookmarked ? "Saved" : "Save for later"}
                        </Button>
                    </div>
                </header>

                {article.featuredImage && (
                    <div className="w-full aspect-video rounded-3xl overflow-hidden bg-muted/20 border border-muted/40 shadow-sm">
                        <img 
                            src={article.featuredImage} 
                            alt={article.title} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <Separator />

                <div 
                    className="prose prose-lg prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-2xl"
                    dangerouslySetInnerHTML={{ __html: article.content || "" }}
                />

                <Separator className="my-10" />

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/30 p-6 rounded-2xl border border-muted/50">
                    <div>
                        <h4 className="font-semibold text-lg">Was this article helpful?</h4>
                        <p className="text-sm text-muted-foreground">Let us know to improve our content recommendations.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="gap-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors" onClick={() => handleReaction("HELPFUL")}>
                            <HugeiconsIcon icon={ThumbsUpIcon} className="w-4 h-4" />
                            Yes, helpful
                        </Button>
                    </div>
                </div>

                <div className="pt-10">
                    <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-8 text-center text-muted-foreground bg-muted/20 rounded-2xl border border-muted/40">
                            More content coming soon
                        </div>
                    </div>
                </div>
            </article>
        </motion.div>
    )
}
