import { motion } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import { LibraryIcon } from "@hugeicons/core-free-icons"
import { Card, CardContent } from "@/components/ui/card"
import type { ContentCategory } from "@/store/health-education/health-education.types"

interface CategoryCardProps {
    category: ContentCategory
    isSelected?: boolean
    onClick?: () => void
}

export function CategoryCard({ category, isSelected = false, onClick }: CategoryCardProps) {
    return (
        <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
            <Card 
                className={`cursor-pointer transition-colors duration-200 ${isSelected ? 'border-primary bg-primary/5' : 'hover:border-primary/30 hover:bg-muted/10'}`}
                onClick={onClick}
            >
                <CardContent className="p-4 flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}`}>
                        <HugeiconsIcon icon={LibraryIcon} className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-medium text-sm">{category.name}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-1">{category.description || "Explore topics"}</p>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
