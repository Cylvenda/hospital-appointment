import { Metadata } from "next"
import { SearchClient } from "./search-client"

export const metadata: Metadata = {
     title: "Search | Admin Dashboard",
     description: "Search patients and appointments",
}

export default function SearchPage() {
     return (
          <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
               <SearchClient />
          </div>
     )
}
