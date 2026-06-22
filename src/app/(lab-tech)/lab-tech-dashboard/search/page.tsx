import { UnifiedSearch } from "@/components/unified-search"
import { Metadata } from "next"

export const metadata: Metadata = {
     title: "Search | Lab Tech Dashboard",
     description: "Search patients and appointments",
}

export default function SearchPage() {
     return (
          <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
               <UnifiedSearch />
          </div>
     )
}
