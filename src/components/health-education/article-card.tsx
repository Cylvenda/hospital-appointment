import Link from "next/link"
import { motion } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import { Time01Icon, ArrowRight01Icon, FavouriteIcon } from "@hugeicons/core-free-icons"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { EducationalContent } from "@/store/health-education/health-education.types"
import { useHealthEducationStore } from "@/store/health-education/health-education.store"
import { formatPublishedDate } from "@/lib/format-published-date"

interface ArticleCardProps {
    article: EducationalContent
    isBookmarked?: boolean
}

export function ArticleCard({ article, isBookmarked = false }: ArticleCardProps) {
    const { toggleBookmark } = useHealthEducationStore()

    const handleBookmark = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        await toggleBookmark(article.slug)
    }

    return (
        <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
            <Link href={`/patient-dashboard/health-education/${article.slug}`}>
                <Card className="h-full overflow-hidden border-muted/40 hover:border-primary/20 hover:shadow-md transition-all duration-300 group">
                    <div className="relative aspect-video w-full bg-muted/20 overflow-hidden">
                        {article.featuredImage ? (
                            <img 
                                src={article.featuredImage} 
                                alt={article.title} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
                                <span className="text-4xl font-bold text-primary/10">{article.category.name[0]}</span>
                            </div>
                        )}
                        <Button 
                            variant="secondary" 
                            size="icon" 
                            className="absolute top-2 right-2 h-8 w-8 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={handleBookmark}
                        >
                            <HugeiconsIcon 
                                icon={FavouriteIcon} 
                                className={`w-4 h-4 ${isBookmarked ? 'fill-primary text-primary' : ''}`} 
                            />
                        </Button>
                        <Badge className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm text-foreground hover:bg-background/90">
                            {article.category.name}
                        </Badge>
                    </div>
                    <CardContent className="p-5 flex flex-col gap-3">
                        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <HugeiconsIcon icon={Time01Icon} className="w-3 h-3" />
                                Published on {formatPublishedDate(article.publishedAt, article.createdAt)}
                            </span>
                            <span>Written by {article.authorName}</span>
                        </div>
                        <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                            {article.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {article.summary}
                        </p>
                        <div className="mt-auto pt-2 flex items-center text-sm font-medium text-primary">
                            Read Article
                            <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </CardContent>
                </Card>
            </Link>
        </motion.div>
    )
}
