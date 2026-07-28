"use client"

import { useEffect, useState, useMemo } from "react"
import { motion } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import { Book01Icon, Search01Icon, ArrowLeft01Icon } from "@hugeicons/core-free-icons"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useHealthEducationStore } from "@/store/health-education/health-education.store"
import { ArticleCard } from "@/components/health-education/article-card"
import { CategoryCard } from "@/components/health-education/category-card"
import { useTranslation } from "@/lib/i18n"

export default function HealthEducationPage() {
    const { t } = useTranslation()
    const { 
        categories, 
        contents, 
        bookmarks, 
        initialized, 
        initialize 
    } = useHealthEducationStore()

    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

    useEffect(() => {
        if (!initialized) {
            void initialize()
        }
    }, [initialized, initialize])

    const filteredContents = useMemo(() => {
        return contents.filter((content) => {
            const matchesSearch = content.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  content.summary.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesCategory = selectedCategory ? content.category.slug === selectedCategory : true
            return matchesSearch && matchesCategory
        })
    }, [contents, searchQuery, selectedCategory])

    const bookmarkedSlugs = useMemo(() => new Set(bookmarks.map(b => b.content.slug)), [bookmarks])

    if (!initialized) {
        return (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
                {t("healthEducation.loadingResources")}
            </div>
        )
    }

    return (
        <motion.div 
            className="w-full max-w-7xl mx-auto space-y-6 sm:space-y-8 p-0 sm:p-2 md:p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="flex flex-col gap-4">
                <Button variant="ghost" asChild className="w-fit -ml-2 sm:-ml-4 gap-2 text-muted-foreground hover:text-foreground">
                    <Link href="/patient-dashboard">
                        <HugeiconsIcon icon={ArrowLeft01Icon} className="w-4 h-4" />
                        {t("healthEducation.returnToDashboard")}
                    </Link>
                </Button>
                <div className="flex items-center justify-between">
                    <div className="min-w-0">
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                            <HugeiconsIcon icon={Book01Icon} className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 text-primary" />
                            {t("healthEducation.patientTitle")}
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            {t("healthEducation.patientSubtitle")}
                        </p>
                    </div>
                </div>

                <div className="relative w-full max-w-md mt-2 sm:mt-4">
                    <HugeiconsIcon icon={Search01Icon} className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input 
                        placeholder={t("healthEducation.searchPlaceholder")}
                        className="pl-10 h-12 rounded-xl bg-card border-muted/60 focus-visible:ring-primary/20"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    {t("healthEducation.browseCategories")}
                </h3>
                <div className="grid grid-cols-1 min-[420px]:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                    <CategoryCard 
                        category={{ id: "all", name: t("healthEducation.allTopics"), slug: "all", description: "", isActive: true }}
                        isSelected={selectedCategory === null}
                        onClick={() => setSelectedCategory(null)}
                    />
                    {categories.filter(c => c.isActive).map(category => (
                        <CategoryCard 
                            key={category.id} 
                            category={category} 
                            isSelected={selectedCategory === category.slug}
                            onClick={() => setSelectedCategory(category.slug)}
                        />
                    ))}
                </div>
            </div>

            <div className="space-y-4 pt-6">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-lg sm:text-xl font-semibold break-words">
                        {selectedCategory ? categories.find(c => c.slug === selectedCategory)?.name : t("healthEducation.latestArticles")}
                    </h3>
                    <span className="text-sm text-muted-foreground">{t("healthEducation.results", { count: filteredContents.length })}</span>
                </div>
                
                {filteredContents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                        {filteredContents.map(article => (
                            <ArticleCard 
                                key={article.id} 
                                article={article} 
                                isBookmarked={bookmarkedSlugs.has(article.slug)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-14 sm:py-20 px-4 text-center bg-card rounded-2xl border border-muted/40">
                        <HugeiconsIcon icon={Book01Icon} className="w-12 h-12 text-muted-foreground/30 mb-4" />
                        <h4 className="text-lg font-medium text-foreground">{t("healthEducation.noResourcesFound")}</h4>
                        <p className="text-muted-foreground mt-1 max-w-md">
                            {t("healthEducation.noResourcesDescription")}
                        </p>
                    </div>
                )}
            </div>
        </motion.div>
    )
}
