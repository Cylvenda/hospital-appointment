"use client"

import { UnifiedSearch } from "@/components/unified-search"
import { AdminSearchHeader } from "./admin-search-header"

export function SearchClient() {
     return (
          <>
               <AdminSearchHeader />
               <UnifiedSearch />
          </>
     )
}
